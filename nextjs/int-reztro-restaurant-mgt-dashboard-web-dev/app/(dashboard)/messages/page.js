"use client";

import { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  InputGroup,
  Modal,
  Dropdown,
} from "react-bootstrap";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Paperclip,
  Send,
  Check,
  CheckCheck,
  PanelRight,
  Image,
  FileText,
  X,
} from "lucide-react";
import { messageService } from "@/services/messageService";

export default function MessagesPage() {
  // --- STATES ---
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Search & Filter Status
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("all");

  // Custom Feature States (New Chat & File Uploads)
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatPayload, setNewChatPayload] = useState({
    name: "",
    role: "customer",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // --- REFS ---
  const socketRef = useRef(null);
  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const pollingRef = useRef(null);

  // Containers Tracking Refs
  const chatContainerRef = useRef(null);
  const activeChatIdRef = useRef(null);

  const isUserAtBottom = useRef(true);

  const currentAdmin = { id: "14", role: "admin" };

  useEffect(() => {
    activeChatIdRef.current = selectedConversation?.conversation_id || null;
  }, [selectedConversation]);

  // --- INITIAL DATA SYNC ---
  useEffect(() => {
    fetchConversations(true);
    return () => {
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.onerror = null;
        socketRef.current.close();
        socketRef.current = null;
      }

      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  // Live client-side dynamic filtering framework
  useEffect(() => {
    let result = conversations;

    if (searchQuery.trim() !== "") {
      result = result.filter(
        (c) =>
          c.participant_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          c.last_message?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (activeRoleFilter !== "all") {
      result = result.filter(
        (c) =>
          c.participant_role?.toLowerCase() === activeRoleFilter.toLowerCase(),
      );
    }

    setFilteredConversations(result);
  }, [searchQuery, activeRoleFilter, conversations]);

  const fetchConversations = async (isInitialMount = false) => {
    try {
      if (conversations.length === 0) setLoading(true);
      const response = await messageService.getConversations();
      const rawData = response.data || response;
      const data = rawData.data || rawData;
      const dataArray = Array.isArray(data) ? data : [];
      setConversations(dataArray);

      if (isInitialMount && dataArray.length > 0 && !activeChatIdRef.current) {
        handleConversationSelect(dataArray[0]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = async (conv) => {
    setSelectedConversation(conv);
    setMessages([]);

    // Naya conversation select hone pe bottom tracker reset karo
    isUserAtBottom.current = true;

    setConversations((prev) =>
      prev.map((c) =>
        c.conversation_id === conv.conversation_id
          ? { ...c, unread_count: 0 }
          : c,
      ),
    );

    try {
      const historyResponse = await messageService.getMessagesByConversation(
        conv.conversation_id,
      );
      const rawHistory = historyResponse.data || historyResponse;
      const historyData = rawHistory.data || rawHistory;
      setMessages(Array.isArray(historyData) ? historyData : []);
      messageService
        .markConversationRead(conv.conversation_id)
        .catch((err) => console.error(err));

      
      setTimeout(() => {
        const container = chatContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 50);

      connectWebSocket(conv.conversation_id);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const syncChatHistory = async (conversationId) => {
    if (activeChatIdRef.current !== conversationId) return;

    try {
      const historyResponse =
        await messageService.getMessagesByConversation(conversationId);

      const rawHistory = historyResponse.data || historyResponse;
      const historyData = rawHistory.data || rawHistory;

      setMessages(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error("Polling sync failed:", error);
    }
  };

  // --- WEBSOCKET CONNECTION ---
  const connectWebSocket = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;
      socketRef.current.close();
    }

    const token = localStorage.getItem("accessToken");

    const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL;

    if (!token) {
      console.error("JWT Token not found.");
      return;
    }

    const wsUrl = `${WS_BASE_URL}/${conversationId}?token=${encodeURIComponent(token)}`;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };

    socketRef.current.onmessage = (event) => {
      try {
        const incomingData = JSON.parse(event.data);
        if (activeChatIdRef.current === conversationId) {
          setMessages((prev) => [...prev, incomingData]);
          if (isUserAtBottom.current) {
            setTimeout(() => {
              const container = chatContainerRef.current;
              if (container) container.scrollTop = container.scrollHeight;
            }, 50);
          }
        }
      } catch (parseError) {
        console.error("Payload validation fail logs:", parseError);
      }
    };

    socketRef.current.onerror = (error) => {
      startHTTPPollingFallback(conversationId);
    };

    socketRef.current.onclose = (closeEvent) => {
      if (closeEvent.code === 1006 && !pollingRef.current) {
        startHTTPPollingFallback(conversationId);
      }
    };
  };

  const startHTTPPollingFallback = (conversationId) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(() => {
      syncChatHistory(conversationId);
    }, 4000);
  };

  const handleCreateNewChat = async (e) => {
    e.preventDefault();
    if (!newChatPayload.name.trim()) return;

    try {
      const payload = {
        participant_name: newChatPayload.name.trim(),
        participant_role: newChatPayload.role,
        conversation_no: `CONV${Date.now().toString().slice(-4)}`,
        last_message: "Conversation started",
        is_active: true,
        unread_count: 0,
      };

      const response = await messageService.createConversation(payload);
      const newConv = response.data || response;

      setShowNewChatModal(false);
      setNewChatPayload({ name: "", role: "customer" });

      await fetchConversations(false);
      handleConversationSelect(newConv);
    } catch (error) {
      console.error("Failed to initialize new conversation workspace:", error);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedFile) || !selectedConversation)
      return;

    let finalAttachmentUrl = null;
    let finalAttachmentType = null;

    if (selectedFile) {
      finalAttachmentType = selectedFile.type.startsWith("image/")
        ? "image"
        : "document";
      finalAttachmentUrl = URL.createObjectURL(selectedFile);
    }

    const messagePayload = {
      conversation_id: Number(selectedConversation.conversation_id),
      conversation_no: String(
        selectedConversation.conversation_no ||
        `CONV${selectedConversation.conversation_id}`,
      ),
      participant_name: String(selectedConversation.participant_name || ""),
      participant_role: String(
        selectedConversation.participant_role || "customer",
      ),
      sender_id: String(currentAdmin.id),
      sender_type: String(currentAdmin.role),
      message_type: finalAttachmentUrl ? finalAttachmentType : "text",
      message_text: inputMessage.trim(),
      attachment_url: finalAttachmentUrl ? String(finalAttachmentUrl) : null,
      attachment_type: finalAttachmentType ? String(finalAttachmentType) : null,
      is_read: selectedConversation.is_online ? true : false,
      is_active: true,
      sent_at: new Date().toISOString(),
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messagePayload));
      setInputMessage("");
      setSelectedFile(null);

      setTimeout(() => {
        const container = chatContainerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
      }, 50);
    } else {
      try {
        const response = await messageService.createMessage(messagePayload);
        const rawData = response.data || response;
        const savedMsg = rawData.data ? rawData.data : rawData;
        setMessages((prev) => [
          ...prev,
          Array.isArray(savedMsg) ? savedMsg[0] : savedMsg,
        ]);
        setInputMessage("");
        setSelectedFile(null);
        setTimeout(() => {
          const container = chatContainerRef.current;
          if (container) container.scrollTop = container.scrollHeight;
        }, 50);
      } catch (error) {
        console.error("Fallback route transmission error:", error);
      }
    }
  };

  const scrollToBottom = () => {
    // Kept for signature compatibility framework validation
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "customer":
        return (
          <Badge
            bg=""
            style={{
              backgroundColor: "#FFEAE2",
              color: "#FF6B35",
              fontSize: "10px",
            }}
            className="fw-normal px-2 py-1 rounded"
          >
            Customer
          </Badge>
        );
      case "kitchen_admin":
        return (
          <Badge
            bg=""
            style={{
              backgroundColor: "#E5F9F6",
              color: "#00B494",
              fontSize: "10px",
            }}
            className="fw-normal px-2 py-1 rounded"
          >
            Kitchen Admin
          </Badge>
        );
      case "head_chef":
      case "chef":
        return (
          <Badge
            bg=""
            style={{
              backgroundColor: "#ECEFF1",
              color: "#37474F",
              fontSize: "10px",
            }}
            className="fw-normal px-2 py-1 rounded"
          >
            Head Chef
          </Badge>
        );
      default:
        return (
          <Badge
            bg="secondary"
            className="fw-normal px-2 py-1 rounded"
            style={{ fontSize: "10px" }}
          >
            {role}
          </Badge>
        );
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getChatDateLabel = (timestamp) => {
    if (!timestamp) return "";

    const msgDate = new Date(timestamp);
    const today = new Date();

    const msgDay = new Date(msgDate.toDateString());
    const todayDay = new Date(today.toDateString());

    const diffTime = todayDay - msgDay;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";

    if (diffDays === 1) {
      return `Yesterday, ${msgDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })}`;
    }

    return msgDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });
  };

  const formatDateLabel = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",   // Saturday
      day: "2-digit",    // 27
      month: "short",    // Jun
    });
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const dateKey = getChatDateLabel(msg.sent_at || msg.created_at);

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(msg);
    return groups;
  }, {});

  return (
    <div className="container-fluid rounded-4 bg-white h-100">
      <Card className="border-0 rounded-5 overflow-hidden">
        <Card.Body className="p-2 p-lg-3">
          <Row className="g-3">
            {/* ================= SIDEBAR LAYOUT ================= */}
            <Col xl={4} lg={4} md={4} className="border-end pe-3 h-100">
              <div className="bg-white rounded-5 h-100 p-2 border-0">
                {/* SEARCH BAR & INTERACTION HANDLERS */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <InputGroup className="bg-light rounded-3 overflow-hidden border-0">
                    <InputGroup.Text className="bg-light border-0 px-3">
                      <Search size={16} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search message, name, etc"
                      className="bg-light border-0 shadow-none py-2 text-dark"
                      style={{ fontSize: "14px" }}
                    />
                  </InputGroup>

                  {/* DROPDOWN FILTER */}
                  <Dropdown>
                    <Dropdown.Toggle
                      as={Button}
                      bsPrefix=" "
                      className="border-0 rounded-3 d-flex align-items-center justify-content-center p-0 flex-shrink-0"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#F7F8FA",
                        color: "#6C757D",
                      }}
                    >
                      <SlidersHorizontal size={16} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="border-0 shadow-sm rounded-3 mt-2">
                      <Dropdown.Item
                        active={activeRoleFilter === "all"}
                        onClick={() => setActiveRoleFilter("all")}
                      >
                        All Roles
                      </Dropdown.Item>
                      <Dropdown.Item
                        active={activeRoleFilter === "customer"}
                        onClick={() => setActiveRoleFilter("customer")}
                      >
                        Customers
                      </Dropdown.Item>
                      <Dropdown.Item
                        active={activeRoleFilter === "Head Chef"}
                        onClick={() => setActiveRoleFilter("Head Chef")}
                      >
                        Head Chefs
                      </Dropdown.Item>
                      <Dropdown.Item
                        active={activeRoleFilter === "kitchen_admin"}
                        onClick={() => setActiveRoleFilter("kitchen_admin")}
                      >
                        Kitchen Admins
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* PLUS (+) BUTTON */}
                  <Button
                    onClick={() => setShowNewChatModal(true)}
                    className="border-0 rounded-3 d-flex align-items-center justify-content-center p-0 flex-shrink-0 text-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#FF6B35",
                    }}
                  >
                    <Plus size={18} />
                  </Button>
                </div>

                {/* SIDEBAR CONVERSATIONS LIST */}
                <div
                  className="pe-1 overflow-auto"
                  style={{
                    maxHeight: "72vh",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {loading ? (
                    <div className="text-center p-4 text-muted small">
                      Loading conversations...
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="text-center p-4 text-muted small">
                      No conversations found.
                    </div>
                  ) : (
                    filteredConversations.map((conv) => {
                      const isSelected =
                        selectedConversation?.conversation_id ===
                        conv.conversation_id;
                      return (
                        <div
                          key={conv.conversation_id}
                          onClick={() => handleConversationSelect(conv)}
                          role="button"
                          className={`py-3 px-2 border-bottom border-light transition-all rounded-3 mb-1 ${isSelected ? "bg-light" : "bg-white"}`}
                        >
                          <div className="d-flex gap-3">
                            <div
                              className="rounded-3 d-flex align-items-center justify-content-center fw-semibold text-dark flex-shrink-0 position-relative"
                              style={{
                                width: "44px",
                                height: "44px",
                                backgroundColor: "#FFEAE2",
                              }}
                            >
                              {conv.avatar_text ||
                                conv.participant_name
                                  ?.substring(0, 2)
                                  .toUpperCase()}
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="d-flex align-items-center gap-2 flex-wrap overflow-hidden">
                                  <h6
                                    className="mb-0 fw-semibold text-dark text-truncate style-title"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {conv.participant_name}
                                  </h6>
                                  {getRoleBadge(conv.participant_role)}
                                </div>
                                <small
                                  className="text-muted text-nowrap"
                                  style={{ fontSize: "11px" }}
                                >
                                  {formatTime(
                                    conv.last_message_time || conv.created_at,
                                  )}
                                </small>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mt-1 gap-2">
                                <span
                                  className="small text-muted text-truncate"
                                  style={{ fontSize: "13px" }}
                                >
                                  {conv.last_message || "No messages yet"}
                                </span>
                                {conv.unread_count > 0 && (
                                  <div
                                    className="text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                      width: "18px",
                                      height: "18px",
                                      fontSize: "10px",
                                      backgroundColor: "#FF6B35",
                                    }}
                                  >
                                    {conv.unread_count}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Col>

            {/* ================= CHAT MAIN AREA PANEL ================= */}
            <Col xl={8} lg={8} md={8}>
              <div className="d-flex flex-column h-100 bg-white rounded-4 p-2">
                {selectedConversation ? (
                  <>
                    {/* ACTIVE CONVERSATION TOP PANEL HEADER */}
                    <div
                      className="p-3 d-flex justify-content-between align-items-center border-bottom mb-3"
                      style={{ backgroundColor: "#FFF" }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-semibold text-dark flex-shrink-0"
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#FFEAE2",
                          }}
                        >
                          {selectedConversation.participant_name
                            ?.substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <h6
                            className="mb-0 fw-bold text-dark"
                            style={{ fontSize: "16px" }}
                          >
                            {selectedConversation.participant_name}
                          </h6>
                          <small
                            className="text-muted d-flex align-items-center gap-1"
                            style={{ fontSize: "12px" }}
                          >
                            <span
                              className={`rounded-circle d-inline-block ${selectedConversation.is_online ? "bg-success" : "bg-secondary"}`}
                              style={{ width: "8px", height: "8px" }}
                            ></span>
                            {selectedConversation.is_online
                              ? "Online"
                              : "Offline"}
                          </small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="light"
                          className="rounded-3 border text-muted d-flex align-items-center justify-content-center"
                          style={{ width: "38px", height: "38px" }}
                        >
                          <Phone size={16} />
                        </Button>
                        <Button
                          variant="light"
                          className="rounded-3 border text-muted d-flex align-items-center justify-content-center"
                          style={{ width: "38px", height: "38px" }}
                        >
                          <Video size={16} />
                        </Button>
                        <Button
                          variant="light"
                          className="rounded-3 border text-muted d-flex align-items-center justify-content-center"
                          style={{ width: "38px", height: "38px" }}
                        >
                          <PanelRight size={16} />
                        </Button>
                      </div>
                    </div>

                    {/* LIVE BUBBLES MESSAGES CONTAINER */}
                    <div
                      ref={chatContainerRef}
                      onScroll={() => {
                        const container = chatContainerRef.current;
                        if (!container) return;
                        // 100px threshold — agar user bottom ke paas hai toh true
                        isUserAtBottom.current =
                          container.scrollHeight - container.scrollTop - container.clientHeight < 100;
                      }}
                      className="flex-grow-1 px-3 py-3 overflow-auto mb-3"
                      style={{
                        minHeight: "450px",
                        maxHeight: "58vh",
                        backgroundColor: "#FAFAFA",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        className="text-center text-muted small mb-4"
                        style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                      >
                        {messages.length > 0
                          ? formatDateLabel(
                            messages[messages.length - 1].sent_at ||
                            messages[messages.length - 1].created_at,
                          )
                          : "Today"}
                      </div>

                      {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
                        <div key={dateLabel}>

                          {/* DATE HEADER */}
                          <div className="text-center text-muted small mb-3 mt-2">
                            {dateLabel}
                          </div>

                          {/* MESSAGES OF THAT DATE */}
                          {msgs.map((msg, index) => {
                            const isOutgoing = msg.sender_type === "admin";

                            return (
                              <div
                                key={msg.message_id || index}
                                className={`d-flex mb-3 ${isOutgoing ? "justify-content-end" : "justify-content-start"
                                  }`}
                              >
                                <div
                                  className={`d-flex gap-2 ${isOutgoing ? "flex-row-reverse" : ""
                                    }`}
                                  style={{ maxWidth: "75%" }}
                                >
                                  <div>
                                    <div
                                      className={`px-3 py-2 ${isOutgoing
                                        ? "text-dark"
                                        : "bg-white border text-dark"
                                        }`}
                                      style={{
                                        borderRadius: "12px",
                                        fontSize: "14px",
                                        backgroundColor: isOutgoing ? "#FFDC60" : "#FFFFFF",
                                      }}
                                    >
                                      {msg.message_text || msg.message}
                                    </div>

                                    <div className="small text-muted mt-1">
                                      {formatTime(msg.sent_at || msg.created_at)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* INPUT FORM SUBMIT FOOTER MODULE */}
                    <Form
                      onSubmit={handleSendMessage}
                      className="border rounded-3 p-2 px-3 shadow-sm bg-white"
                    >
                      {selectedFile && (
                        <div className="d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded border border-warning animate-fade-in">
                          <div className="d-flex align-items-center gap-2 text-dark small text-truncate">
                            {selectedFile.type.startsWith("image/") ? (
                              <Image size={16} className="text-warning" />
                            ) : (
                              <FileText size={16} className="text-primary" />
                            )}
                            <span className="text-truncate fw-medium">
                              {selectedFile.name}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="link"
                            className="p-0 text-muted"
                            onClick={() => setSelectedFile(null)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      )}

                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="d-none"
                          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                        />

                        <Button
                          type="button"
                          variant="link"
                          className="p-0 text-muted border-0 shadow-none"
                        >
                          <Smile size={18} />
                        </Button>

                        <Form.Control
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Type a message.."
                          className="border-0 shadow-none py-2 text-dark"
                          style={{ fontSize: "14px" }}
                        />

                        <Button
                          type="button"
                          onClick={triggerFileSelect}
                          variant="link"
                          className={`p-0 border-0 shadow-none ${selectedFile ? "text-warning" : "text-muted"}`}
                        >
                          <Paperclip size={18} />
                        </Button>

                        <Button
                          type="submit"
                          className="rounded-3 border-0 px-4 py-2 d-flex align-items-center text-white gap-2 flex-shrink-0"
                          style={{ backgroundColor: "#FF6B35" }}
                        >
                          Send <Send size={14} />
                        </Button>
                      </div>
                    </Form>
                  </>
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                    <h5>Welcome to Reztro Messages Workspace</h5>
                    <p className="small text-center">
                      Select an active conversation thread profile snapshot from
                      the sidebar navigation layout panel.
                    </p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* CREATE NEW CHAT MODAL WINDOW */}
      <Modal
        show={showNewChatModal}
        onHide={() => setShowNewChatModal(false)}
        centered
        dialogClassName="rounded-4 overflow-hidden"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-semibold fs-5 text-dark">
            Start New Chat Channel
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateNewChat}>
          <Modal.Body className="py-3">
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted fw-medium">
                Participant Full Name
              </Form.Label>
              <Form.Control
                type="text"
                required
                value={newChatPayload.name}
                onChange={(e) =>
                  setNewChatPayload((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter client or staff designation title..."
                className="py-2 bg-light border-0 rounded-3 shadow-none text-dark"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="small text-muted fw-medium">
                System Role
              </Form.Label>
              <Form.Select
                value={newChatPayload.role}
                onChange={(e) =>
                  setNewChatPayload((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                className="py-2 bg-light border-0 rounded-3 shadow-none text-dark"
              >
                <option value="customer">Customer</option>
                <option value="head_chef">Head Chef / Kitchen Lead</option>
                <option value="kitchen_admin">Kitchen Management Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button
              variant="light"
              type="button"
              className="rounded-3 px-3 border"
              onClick={() => setShowNewChatModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="rounded-3 px-4 text-white"
              style={{ backgroundColor: "#FF6B35", border: "0" }}
            >
              Create Thread
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
