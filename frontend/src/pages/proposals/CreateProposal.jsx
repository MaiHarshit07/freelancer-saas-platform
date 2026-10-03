import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";
import FormCard from "../../components/ui/FormCard";

import { createProposal } from "../../services/proposalService";


export default function CreateProposal() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bidAmount: "",
    coverLetter: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bidAmount || !formData.coverLetter.trim()) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setSubmitting(true);

      await createProposal({
        projectId,
        bidAmount: Number(formData.bidAmount),
        coverLetter: formData.coverLetter.trim(),
      });

      toast.success("Proposal submitted successfully.");

      navigate("/my-proposals");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to submit proposal."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back */}

      <Link
        to="/browse-projects"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          text-[#C7D2CC]
          transition
          hover:text-[#D4AF37]
        "
      >
        <FaArrowLeft />

        Back to Projects
      </Link>

      {/* Header */}

      <PageHeader
        title="Submit Proposal"
        subtitle="Send your proposal to the client."
      />

      {/* Form */}

      <FormCard>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Bid */}

          <div>
            <label
              htmlFor="bidAmount"
              className="mb-2 block text-sm font-medium text-[#C7D2CC]"
            >
              Your Bid Amount (₹)
            </label>

            <input
              id="bidAmount"
              name="bidAmount"
              type="number"
              min="1"
              value={formData.bidAmount}
              onChange={handleChange}
              disabled={submitting}
              placeholder="Enter your bid"
              className="
                w-full
                rounded-xl
                border
                border-[#22362B]
                bg-[#07140E]
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-[#D4AF37]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </div>

          {/* Cover Letter */}

          <div>
            <label
              htmlFor="coverLetter"
              className="mb-2 block text-sm font-medium text-[#C7D2CC]"
            >
              Cover Letter
            </label>

            <textarea
              id="coverLetter"
              name="coverLetter"
              rows="8"
              value={formData.coverLetter}
              onChange={handleChange}
              disabled={submitting}
              placeholder="Explain why you are a good fit for this project..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-[#22362B]
                bg-[#07140E]
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-[#D4AF37]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </div>

          {/* Submit */}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#D4AF37]
                px-6
                py-3
                font-medium
                text-[#07140E]
                transition
                hover:scale-105
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:scale-100
              "
            >
              <FaPaperPlane />

              {submitting
                ? "Submitting..."
                : "Submit Proposal"}
            </button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
