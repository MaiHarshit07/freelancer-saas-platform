import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";

import {
  getProjectMessages,
  sendMessage,
} from "../../services/messageService";
import { getProjectById } from "../../services/projectService";

import {
  connectSocket,
  joinProjectRoom,
  leaveProjectRoom,
  getSocket,
} from "../../services/socketService";

import { useAuth } from "../../context/AuthContext";


function ProjectMessages() {
  const { id } = useParams();

  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] =
    useState(false);

  const messagesEndRef = useRef(null);


  // ==========================================
  // LOAD OLD MESSAGES
  // ==========================================

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchMessages();
  }, [id]);


  const fetchMessages = async () => {
    try {
      setLoading(true);

      const [projectData, messagesData] = await Promise.all([
        getProjectById(id),
        getProjectMessages(id),
      ]);

      setProject(projectData);
      setMessages(messagesData || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load messages.",
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // SOCKET CONNECTION
  // ==========================================

  useEffect(() => {
    if (!id || !user) {
      return;
    }

    const socket = connectSocket();

    if (!socket) {
      return;
    }


    const handleConnect = () => {
      console.log(
        "Socket connected:",
        socket.id,
      );

      setSocketConnected(true);

      joinProjectRoom(id);
    };


    const handleDisconnect = () => {
      console.log("Socket disconnected");

      setSocketConnected(false);
    };


    const handleConnectError = (error) => {
      console.error(
        "Socket connection error:",
        error.message,
      );

      setSocketConnected(false);
    };


    const handleReceiveMessage = (message) => {
      if (!message) {
        return;
      }

      setMessages((prev) => {

        const alreadyExists = prev.some(
          (existingMessage) =>
            existingMessage._id === message._id,
        );

        if (alreadyExists) {
          return prev;
        }

        return [...prev, message];
      });
    };


    socket.on("connect", handleConnect);

    socket.on(
      "disconnect",
      handleDisconnect,
    );

    socket.on(
      "connect_error",
      handleConnectError,
    );

    socket.on(
      "receiveMessage",
      handleReceiveMessage,
    );


    if (socket.connected) {
      handleConnect();
    }


    return () => {
      leaveProjectRoom(id);

      socket.off(
        "connect",
        handleConnect,
      );

      socket.off(
        "disconnect",
        handleDisconnect,
      );

      socket.off(
        "connect_error",
        handleConnectError,
      );

      socket.off(
        "receiveMessage",
        handleReceiveMessage,
      );
    };
  }, [id, user]);


  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    const socket = getSocket();

    if (!socketConnected || !socket) {
      toast.error(
        "Chat connection is not available.",
      );

      return;
    }

    try {
      setSending(true);


      const currentUserId = String(user?._id);
      const ownerId = project?.createdBy?._id || project?.createdBy;
      const freelancerId =
        project?.assignedFreelancer?._id || project?.assignedFreelancer;
      const receiverId =
        String(ownerId) === currentUserId ? freelancerId : ownerId;

      if (!receiverId || String(receiverId) === currentUserId) {
        toast.error(
          "Unable to identify the receiver.",
        );

        return;
      }


      const response = await sendMessage({
        projectId: id,
        receiverId,
        content: trimmedContent,
      });


      const newMessage = response;


      setMessages((prev) => {

        const exists = prev.some(
          (message) =>
            message._id === newMessage._id,
        );

        if (exists) {
          return prev;
        }

        return [...prev, newMessage];
      });


      socket.emit("sendMessage", {
        message: newMessage,
        projectId: id,
      });


      setContent("");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to send message.",
      );
    } finally {
      setSending(false);
    }
  };


  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-[#76837B]">
          Loading messages...
        </p>
      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <Link
          to={`/projects/${id}`}
          className="mb-5 inline-flex items-center gap-2 text-[#D4AF37] hover:underline"
        >
          <FaArrowLeft />

          Back to Project
        </Link>

        <div className="flex items-center justify-between gap-4">

          <PageHeader
            title="Project Messages"
            subtitle="Communicate securely with the project participant."
          />

          <div className="flex items-center gap-2 text-sm">

            <span
              className={`h-2.5 w-2.5 rounded-full ${
                socketConnected
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />

            <span className="text-[#9AA8A1]">
              {socketConnected
                ? "Live"
                : "Offline"}
            </span>

          </div>

        </div>
      </div>


      {/* CHAT */}

      <div
        className="
          flex
          h-162.5
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[#22362B]
          bg-[#102018]
        "
      >

        {/* MESSAGES */}

        <div className="flex-1 space-y-4 overflow-y-auto p-6">

          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Start the conversation
                </h2>

                <p className="mt-2 text-[#76837B]">
                  Send your first message.
                </p>

              </div>

            </div>
          ) : (
            messages.map((message) => {

              const isOwnMessage =
                String(message.sender?._id || message.sender) ===
                String(user?._id);

              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isOwnMessage
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`
                      max-w-[75%]
                      rounded-2xl
                      px-4
                      py-3
                      ${
                        isOwnMessage
                          ? "bg-[#D4AF37] text-[#07140E]"
                          : "bg-[#16281F] text-[#C7D2CC]"
                      }
                    `}
                  >

                    {!isOwnMessage && (
                      <p className="mb-1 text-xs font-semibold text-[#D4AF37]">
                        {message.sender?.name ||
                          "User"}
                      </p>
                    )}

                    <p className="wrap-break-word text-sm leading-6">
                      {message.content}
                    </p>

                    <p
                      className={`
                        mt-1 text-right text-[11px]
                        ${
                          isOwnMessage
                            ? "text-[#07140E]/60"
                            : "text-[#76837B]"
                        }
                      `}
                    >
                      {formatTime(
                        message.createdAt,
                      )}
                    </p>

                  </div>

                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />

        </div>


        {/* INPUT */}

        <form
          onSubmit={handleSubmit}
          className="
            flex
            gap-3
            border-t
            border-[#22362B]
            p-4
          "
        >

          <input
            type="text"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Type your message..."
            disabled={!socketConnected || sending}
            className="
              flex-1
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
              disabled:opacity-50
            "
          />

          <button
            type="submit"
            disabled={
              !content.trim() ||
              !socketConnected ||
              sending
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#D4AF37]
              px-5
              py-3
              font-medium
              text-[#07140E]
              transition
              hover:scale-105
              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:scale-100
            "
          >
            <FaPaperPlane />

            {sending
              ? "Sending..."
              : "Send"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ProjectMessages;