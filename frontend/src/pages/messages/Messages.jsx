import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaComments, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";
import { getMyConversations } from "../../services/messageService";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);

      const data = await getMyConversations();

      setConversations(data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load conversations."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString([], {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <PageHeader
        title="Messages"
        subtitle="Communicate with clients and freelancers."
      />


      {/* Content */}

      {loading ? (
        <div
          className="
            flex
            min-h-96
            items-center
            justify-center
            rounded-2xl
            border
            border-[#22362B]
            bg-[#102018]
          "
        >
          <p className="text-lg text-[#76837B]">
            Loading conversations...
          </p>
        </div>
      ) : conversations.length === 0 ? (
        <div
          className="
            flex
            min-h-96
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-[#22362B]
            bg-[#102018]
            px-6
            text-center
          "
        >
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[#16281F]
              text-2xl
              text-[#D4AF37]
            "
          >
            <FaComments />
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-white">
            No Conversations Yet
          </h2>

          <p className="mt-3 max-w-md text-[#9AA8A1]">
            Your project conversations will appear here once
            you start messaging with a client or freelancer.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {conversations.map((conversation) => {
            const project = conversation.project;
            const otherUser = conversation.otherUser;
            const latestMessage =
              conversation.latestMessage;

            if (!project) return null;

            return (
              <Link
                key={project._id}
                to={`/projects/${project._id}/messages`}
                className="
                  block
                  rounded-2xl
                  border
                  border-[#22362B]
                  bg-[#102018]
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#D4AF37]
                  hover:bg-[#16281F]
                "
              >
                <div className="flex items-start gap-4">

                  {/* Avatar */}

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#16281F]
                      text-lg
                      font-semibold
                      text-[#D4AF37]
                    "
                  >
                    {otherUser?.name
                      ? otherUser.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </div>


                  {/* Conversation */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <h2 className="truncate text-lg font-semibold text-white">
                          {project.title}
                        </h2>

                        <p className="mt-1 text-sm text-[#D4AF37]">
                          {otherUser?.name ||
                            "Unknown User"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#76837B]">
                        <FaClock />

                        {formatMessageTime(
                          latestMessage?.createdAt
                        )}
                      </div>

                    </div>


                    {/* Latest Message */}

                    <p className="mt-3 truncate text-sm text-[#9AA8A1]">
                      {latestMessage?.content ||
                        "No messages yet."}
                    </p>


                    {/* Project Status */}

                    <div className="mt-4 flex items-center justify-between">

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-medium
                          ${
                            project.status ===
                            "completed"
                              ? "bg-blue-900/30 text-blue-400"
                              : project.status ===
                                "in-progress"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-green-900/30 text-green-400"
                          }
                        `}
                      >
                        {project.status}
                      </span>

                      <span className="text-xs text-[#76837B]">
                        Open conversation →
                      </span>

                    </div>

                  </div>

                </div>
              </Link>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Messages;