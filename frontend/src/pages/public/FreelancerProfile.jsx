import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";

import { getFreelancerProfile } from "../../services/userService";

const formatDate = (date) => {
  if (!date) return "Recently";

  const value = new Date(date);
  return Number.isNaN(value.getTime())
    ? "Recently"
    : value.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

function FreelancerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getFreelancerProfile(id);
      setProfile(result);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Failed to load freelancer profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFFFFF] px-4 py-16 text-center text-[#52705D]">
        Loading freelancer profile...
      </main>
    );
  }

  if (error || !profile?.freelancer) {
    return (
      <main className="min-h-screen bg-[#FFFFFF] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-500/30 bg-[#F8FBF8] p-8 text-center">
          <p className="text-red-700">{error || "Freelancer not found."}</p>
          <button
            type="button"
            onClick={loadProfile}
            className="mt-5 rounded-lg border border-[#DCE8DE] px-4 py-2 text-sm text-[#14532D] transition hover:border-[#D4AF37]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const { freelancer, portfolio = [], reviews = [], averageRating = 0, reviewCount = 0 } = profile;

  return (
    <main className="min-h-screen bg-[#FFFFFF] px-4 py-10 text-[#52705D] md:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          to="/browse-projects"
          className="inline-flex items-center gap-2 text-sm text-[#D4AF37] transition hover:underline"
        >
          <FaArrowLeft size={12} />
          Back to projects
        </Link>

        <section className="flex flex-col gap-6 rounded-2xl border border-[#DCE8DE] bg-[#F8FBF8] p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DCE8DE] bg-[#F1F7F1] text-2xl font-bold text-[#D4AF37]">
              {freelancer.profileImage?.url ? (
                <img
                  src={freelancer.profileImage.url}
                  alt={freelancer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                freelancer.name?.charAt(0)?.toUpperCase() || "F"
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#66816D]">
                Freelancer profile
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#14532D]">{freelancer.name}</h1>
              {freelancer.title && (
                <p className="mt-1 text-[#52705D]">{freelancer.title}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5 border-t border-[#DCE8DE] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <p className="text-sm text-[#66816D]">Rating</p>
              <p className="mt-1 text-2xl font-bold text-[#14532D]">
                {Number(averageRating).toFixed(1)} <span className="text-sm text-[#D4AF37]">/ 5</span>
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#D4AF37]" aria-label={`${reviewCount} reviews`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= Math.round(averageRating) ? "text-[#D4AF37]" : "text-[#52705D]"}
                />
              ))}
            </div>
            <div>
              <p className="text-sm text-[#66816D]">Reviews</p>
              <p className="mt-1 text-2xl font-bold text-[#14532D]">{reviewCount}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#DCE8DE] bg-[#F8FBF8] p-6">
              <h2 className="text-lg font-semibold text-[#14532D]">About</h2>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-[#52705D]">
                {freelancer.bio || "No profile description added yet."}
              </p>
            </div>

            <div className="rounded-2xl border border-[#DCE8DE] bg-[#F8FBF8] p-6">
              <h2 className="text-lg font-semibold text-[#14532D]">Skills</h2>
              {freelancer.skills?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[#DCE8DE] bg-[#F4F8F4] px-3 py-1.5 text-sm text-[#D4AF37]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-[#66816D]">No skills listed.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE8DE] bg-[#F8FBF8] p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#14532D]">Portfolio</h2>
              <span className="text-sm text-[#66816D]">{portfolio.length} projects</span>
            </div>
            {portfolio.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {portfolio.map((item) => (
                  <article key={item._id} className="overflow-hidden rounded-xl border border-[#DCE8DE] bg-[#FFFFFF]">
                    {item.image?.url && (
                      <img src={item.image.url} alt={item.title} className="h-40 w-full object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-[#14532D]">{item.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#52705D]">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-[#DCE8DE] p-6 text-center text-sm text-[#66816D]">
                No portfolio projects yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#DCE8DE] bg-[#F8FBF8] p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#14532D]">Client reviews</h2>
            <span className="text-sm text-[#66816D]">{reviewCount} total</span>
          </div>
          {reviews.length ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article key={review._id} className="rounded-xl border border-[#DCE8DE] bg-[#FFFFFF] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-[#14532D]">
                        {review.reviewer?.name || "Client"}
                      </h3>
                      <p className="text-sm text-[#66816D]">
                        {review.project?.title || "Completed project"}
                      </p>
                    </div>
                    <time className="text-sm text-[#66816D]">{formatDate(review.createdAt)}</time>
                  </div>
                  <div className="mt-3 flex gap-1 text-[#D4AF37]" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= review.rating ? "text-[#D4AF37]" : "text-[#52705D]"}
                      />
                    ))}
                  </div>
                  <p className="mt-3 leading-7 text-[#52705D]">{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-[#DCE8DE] p-6 text-center text-sm text-[#66816D]">
              No reviews yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default FreelancerProfile;