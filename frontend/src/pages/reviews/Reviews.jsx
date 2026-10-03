import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle, FaStar } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { getMyProjects } from "../../services/projectService";
import {
  getFreelancerReviews,
  getGivenReviews,
  submitReview,
} from "../../services/reviewService";

const starLabels = [5, 4, 3, 2, 1];

const formatDate = (date) => {
  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

function Reviews() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedProjectId = searchParams.get("projectId");

  const [reviews, setReviews] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [reviewableProjects, setReviewableProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState({
    reviews: true,
    given: false,
    projects: true,
    submit: false,
  });
  const [loadErrors, setLoadErrors] = useState({
    reviews: "",
    given: "",
    projects: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const isFreelancer = user?.role === "freelancer";

  const summary = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0);
    const average = total ? sum / total : 0;

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      const current = Number(review.rating || 0);
      if (distribution[current] !== undefined) distribution[current] += 1;
    });

    return {
      total,
      average,
      distribution,
    };
  }, [reviews]);

  const loadFreelancerReviews = async () => {
    if (!user?._id || !isFreelancer) {
      setReviews([]);
      setLoading((prev) => ({ ...prev, reviews: false }));
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, reviews: true }));
      setLoadErrors((prev) => ({ ...prev, reviews: "" }));
      const response = await getFreelancerReviews(user._id);
      setReviews(response.data || []);
    } catch (error) {
      setLoadErrors((prev) => ({
        ...prev,
        reviews: error?.response?.data?.message || "Failed to load reviews.",
      }));
      setStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to load reviews.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, reviews: false }));
    }
  };

  const loadGivenReviews = async () => {
    if (!user || user.role !== "client") return null;

    try {
      setLoading((prev) => ({ ...prev, given: true }));
      setLoadErrors((prev) => ({ ...prev, given: "" }));
      const response = await getGivenReviews();
      const result = response.data || [];
      setGivenReviews(result);
      return result;
    } catch (error) {
      setLoadErrors((prev) => ({
        ...prev,
        given: error?.response?.data?.message || "Failed to load given reviews.",
      }));
      setStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to load given reviews.",
      });
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, given: false }));
    }
  };

  const loadReviewableProjects = async (givenReviewList = []) => {
    if (!user || user.role !== "client") return;

    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      setLoadErrors((prev) => ({ ...prev, projects: "" }));
      const projects = await getMyProjects();
      const reviewedProjectIds = new Set(
        givenReviewList.map((review) =>
          String(review.project?._id || review.project),
        ),
      );
      const eligibleProjects = projects.filter(
        (project) =>
          project.status === "completed" &&
          project.assignedFreelancer &&
          !reviewedProjectIds.has(String(project._id)),
      );

      setReviewableProjects(eligibleProjects);
      const requestedProjectIsEligible = eligibleProjects.some(
        (project) => project._id === requestedProjectId,
      );
      setSelectedProjectId(
        requestedProjectIsEligible
          ? requestedProjectId
          : eligibleProjects[0]?._id || "",
      );
    } catch (error) {
      setLoadErrors((prev) => ({
        ...prev,
        projects:
          error?.response?.data?.message || "Failed to load completed projects.",
      }));
      setStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to load completed projects.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  const retryClientReviewData = async () => {
    const givenReviewList = await loadGivenReviews();
    if (givenReviewList) {
      await loadReviewableProjects(givenReviewList);
    }
  };

  useEffect(() => {
    if (!user) return;

    if (isFreelancer) {
      loadFreelancerReviews();
    } else if (user.role === "client") {
      loadGivenReviews().then((givenReviewList) => {
        if (givenReviewList) {
          loadReviewableProjects(givenReviewList);
        } else {
          setLoading((prev) => ({ ...prev, projects: false }));
        }
      });
    }
  }, [user, requestedProjectId]);

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!selectedProjectId) {
      setStatus({ type: "error", message: "Please select a completed project." });
      return;
    }

    if (comment.trim().length < 3 || comment.trim().length > 2000) {
      setStatus({
        type: "error",
        message: "Review text must be between 3 and 2000 characters.",
      });
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      setStatus({ type: "", message: "" });

      const response = await submitReview({
        projectId: selectedProjectId,
        rating,
        comment: comment.trim(),
      });

      const selectedProject = reviewableProjects.find(
        (project) => project._id === selectedProjectId,
      );
      setGivenReviews((currentReviews) => [
        {
          ...response.review,
          project: { title: selectedProject?.title || "Completed project" },
          freelancer: {
            name:
              selectedProject?.assignedFreelancer?.name || "Assigned freelancer",
          },
        },
        ...currentReviews,
      ]);
      const remainingProjects = reviewableProjects.filter(
        (project) => project._id !== selectedProjectId,
      );
      setReviewableProjects(remainingProjects);
      setSelectedProjectId(remainingProjects[0]?._id || "");

      setComment("");
      setRating(5);
      setStatus({ type: "success", message: "Review submitted successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to submit review.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-6 shadow-lg shadow-[#07140E]/30">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8CA096]">
          Feedback
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Reviews</h1>
      </div>

      {status.message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/40 bg-red-500/10 text-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {status.type === "success" ? (
              <FaCheckCircle size={14} />
            ) : (
              <FaExclamationTriangle size={14} />
            )}
            <span>{status.message}</span>
          </div>
        </div>
      )}

      {isFreelancer && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5">
            <p className="text-sm text-[#8CA096]">Overall rating</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-3xl font-bold text-white">
                {summary.average ? summary.average.toFixed(1) : "0.0"}
              </span>
              <span className="text-[#D4AF37]">/ 5</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5">
            <p className="text-sm text-[#8CA096]">Total reviews</p>
            <p className="mt-2 text-3xl font-bold text-white">{summary.total}</p>
          </div>

          <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5">
            <p className="text-sm text-[#8CA096]">Average rating</p>
            <div className="mt-2 flex items-center gap-1 text-[#D4AF37]">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  size={16}
                  className={
                    index < Math.round(summary.average || 0)
                      ? "text-[#D4AF37]"
                      : "text-[#33453E]"
                  }
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5">
            <p className="text-sm text-[#8CA096]">This month</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {reviews.filter((review) => {
                const createdAt = new Date(review.createdAt);
                const now = new Date();
                const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
                return diffDays <= 30;
              }).length}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {isFreelancer && (
          <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-white">Rating summary</h2>
              <span className="rounded-full bg-[#1A3023] px-3 py-1 text-xs font-semibold text-[#D4AF37]">
                {summary.total} reviews
              </span>
            </div>

            <div className="space-y-3">
              {starLabels.map((star) => {
                const percent = summary.total
                  ? (summary.distribution[star] / summary.total) * 100
                  : 0;

                return (
                  <div key={star} className="grid grid-cols-[40px_1fr_40px] items-center gap-3">
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      <span className="text-sm font-medium">{star}</span>
                      <FaStar size={12} />
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#13241D]">
                      <div
                        className="h-full rounded-full bg-[#D4AF37]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span className="text-right text-sm text-[#C7D2CC]">
                      {summary.distribution[star]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isFreelancer && (
          <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5 md:p-6">
            <h2 className="text-xl font-bold text-white">Leave Review</h2>

            {loading.projects || loading.given ? (
              <div className="mt-4 text-sm text-[#8CA096]">Loading completed projects...</div>
            ) : loadErrors.given || loadErrors.projects ? (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert">
                <p>{loadErrors.given || loadErrors.projects}</p>
                <button
                  type="button"
                  onClick={retryClientReviewData}
                  className="mt-3 font-semibold text-white underline underline-offset-4"
                >
                  Retry
                </button>
              </div>
            ) : reviewableProjects.length === 0 ? (
              <div className="mt-4 rounded-xl border border-[#22362B] bg-[#091912] p-4 text-sm text-[#C7D2CC]">
                {givenReviews.length > 0
                  ? "You have reviewed all eligible completed projects."
                  : "You can leave reviews only for completed projects with an assigned freelancer."}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">
                    Project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(event) => setSelectedProjectId(event.target.value)}
                    className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                  >
                    {reviewableProjects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        aria-pressed={value === rating}
                        className="text-2xl transition hover:scale-110"
                        aria-label={`Rate ${value} star`}
                      >
                        <FaStar
                          className={value <= rating ? "text-[#D4AF37]" : "text-[#33453E]"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">
                    Review/comment
                  </label>
                  <textarea
                    rows={5}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    minLength={3}
                    maxLength={2000}
                    required
                    placeholder="Share your experience working with this freelancer..."
                    className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading.submit}
                  className="w-full rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading.submit ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {isFreelancer && (
        <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Received reviews</h2>
            <span className="rounded-full bg-[#1A3023] px-3 py-1 text-xs font-semibold text-[#D4AF37]">
              {summary.total} total
            </span>
          </div>

          {loading.reviews ? (
            <div className="text-sm text-[#8CA096]">Loading reviews...</div>
          ) : loadErrors.reviews ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert">
              <p>{loadErrors.reviews}</p>
              <button
                type="button"
                onClick={loadFreelancerReviews}
                className="mt-3 font-semibold text-white underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#22362B] bg-[#0B1714] p-6 text-center text-[#8CA096]">
              No reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl border border-[#22362B] bg-[#0B1714] p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#1A3023] text-sm font-bold text-[#D4AF37]">
                        {review.reviewer?.profileImage?.url ? (
                          <img
                            src={review.reviewer.profileImage.url}
                            alt={review.reviewer.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          review.reviewer?.name?.charAt(0)?.toUpperCase() || "U"
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {review.reviewer?.name || "Anonymous reviewer"}
                        </h3>
                        <p className="text-sm text-[#8CA096]">
                          {review.project?.title || "Project review"}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-[#8CA096]">{formatDate(review.createdAt)}</div>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-[#D4AF37]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={14}
                        className={star <= Number(review.rating || 0) ? "text-[#D4AF37]" : "text-[#33453E]"}
                      />
                    ))}
                  </div>

                  <p className="mt-4 text-[#C7D2CC]">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isFreelancer && user?.role === "client" && (
        <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Reviews you gave</h2>
            <span className="rounded-full bg-[#1A3023] px-3 py-1 text-xs font-semibold text-[#D4AF37]">
              {givenReviews.length} total
            </span>
          </div>

          {loading.given ? (
            <div className="text-sm text-[#8CA096]">Loading given reviews...</div>
          ) : loadErrors.given ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert">
              <p>{loadErrors.given}</p>
              <button
                type="button"
                onClick={retryClientReviewData}
                className="mt-3 font-semibold text-white underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          ) : givenReviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#22362B] bg-[#0B1714] p-6 text-center text-[#8CA096]">
              You have not submitted any reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {givenReviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl border border-[#22362B] bg-[#0B1714] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">
                        {review.freelancer?.name || "Assigned freelancer"}
                      </h3>
                      <p className="text-sm text-[#8CA096]">
                        {review.project?.title || "Completed project"}
                      </p>
                    </div>
                    <span className="text-sm text-[#8CA096]">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[#D4AF37]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={14}
                        className={
                          star <= Number(review.rating || 0)
                            ? "text-[#D4AF37]"
                            : "text-[#33453E]"
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-[#C7D2CC]">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reviews;
