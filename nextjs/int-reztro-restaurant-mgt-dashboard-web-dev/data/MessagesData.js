export const messageUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "customer",
    avatar_url: null,
    avatar_text: null,
    is_online: true,
    last_message: "Absolutely! We'll reserve a window table for your...",
    last_message_time: "09:23 AM",
    unread_count: 0,
    is_read: true,
    is_active: true
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "customer",
    avatar_url: null,
    avatar_text: "BS",
    is_online: false,
    last_message: "Thanks for the great service yesterday!",
    last_message_time: "09:15 AM",
    unread_count: 0,
    is_read: false,
    is_active: false
  },
  {
    id: 3,
    name: "Charlie Brown",
    role: "customer",
    avatar_url: null,
    avatar_text: null,
    is_online: false,
    last_message: "Could you confirm the ingredients in the Truff...",
    last_message_time: "09:05 AM",
    unread_count: 3,
    is_read: false,
    is_active: false
  },
  {
    id: 4,
    name: "Maria Kings",
    role: "kitchen_admin",
    avatar_url: null,
    avatar_text: null,
    is_online: false,
    last_message: "I had an issue with my last order. Can we disc...",
    last_message_time: "08:56 AM",
    unread_count: 1,
    is_read: false,
    is_active: false
  },
  {
    id: 5,
    name: "Eve Carter",
    role: "customer",
    avatar_url: null,
    avatar_text: "EC",
    is_online: false,
    last_message: "Is there a gluten-free option for the main cou...",
    last_message_time: "08:20 PM",
    unread_count: 2,
    is_read: false,
    is_active: false
  },
  {
    id: 6,
    name: "Frank Miller",
    role: "customer",
    avatar_url: null,
    avatar_text: "FM",
    is_online: false,
    last_message: "Please confirm my order details before delive...",
    last_message_time: "08:14 AM",
    unread_count: 2,
    is_read: false,
    is_active: false
  },
  {
    id: 7,
    name: "Vincent Law",
    role: "head_chef",
    avatar_url: null,
    avatar_text: null,
    is_online: false,
    last_message: "Good morning! Unfortunately, our outdoor se...",
    last_message_time: "08:05 AM",
    unread_count: 0,
    is_read: true,
    is_active: false
  },
  {
    id: 8,
    name: "Hannah Gold",
    role: "customer",
    avatar_url: null,
    avatar_text: null,
    is_online: false,
    last_message: "Certainly! How much extra BBQ sauce would...",
    last_message_time: "04:30 PM",
    unread_count: 0,
    is_read: true,
    is_active: false
  },
  {
    id: 9,
    name: "Lincoln Botsch",
    role: "customer",
    avatar_url: null,
    avatar_text: null,
    is_online: false,
    last_message: "Is it possible to get extra sauce with the BBQ...",
    last_message_time: "04:30 PM",
    unread_count: 5,
    is_read: false,
    is_active: false
  }
];

export const messageConversations = [
  {
    id: 1,
    conversation_id: "CONV001",
    user_id: 1,
    user: {
      id: 1,
      name: "Alice Johnson",
      role: "customer",
      avatar_url: null,
      is_online: true
    },
    date_label: "Today, Oct 5",
    messages: [
      {
        id: 1,
        conversation_id: "CONV001",
        sender_id: 1,
        sender_type: "customer",
        message_type: "text",
        message: "Hello! Can I update my reservation for tonight?",
        attachment_url: null,
        attachment_type: null,
        sent_at: "2035-10-05T09:15:00",
        time: "09:15 AM",
        is_read: true
      },
      {
        id: 2,
        conversation_id: "CONV001",
        sender_id: "admin",
        sender_type: "admin",
        message_type: "text",
        message: "Hi Alice! Of course. What would you like to change?",
        attachment_url: null,
        attachment_type: null,
        sent_at: "2035-10-05T09:17:00",
        time: "09:17 AM",
        is_read: true
      },
      {
        id: 3,
        conversation_id: "CONV001",
        sender_id: 1,
        sender_type: "customer",
        message_type: "text",
        message: "I need to add two more guests to the reservation. Is that possible?",
        attachment_url: null,
        attachment_type: null,
        sent_at: "2035-10-05T09:18:00",
        time: "09:18 AM",
        is_read: true
      },
      {
        id: 4,
        conversation_id: "CONV001",
        sender_id: "admin",
        sender_type: "admin",
        message_type: "text",
        message: "Yes, we can accommodate that. Let me update your reservation for a total of four guests.",
        attachment_url: null,
        attachment_type: null,
        sent_at: "2035-10-05T09:20:00",
        time: "09:20 AM",
        is_read: true
      },
      {
        id: 5,
        conversation_id: "CONV001",
        sender_id: 1,
        sender_type: "customer",
        message_type: "text",
        message: "Perfect, thank you! Will there still be a window table available?",
        attachment_url: null,
        attachment_type: null,
        sent_at: "2035-10-05T09:21:00",
        time: "09:21 AM",
        is_read: true
      },
      {
        id: 6,
        conversation_id: "CONV001",
        sender_id: "admin",
        sender_type: "admin",
        message_type: "text",
        message: "Absolutely! We'll reserve a window table for your party. Looking forward to seeing you tonight!",
        attachment_url: null,
        attachment_type: null,
        sent_at: "2035-10-05T09:23:00",
        time: "09:23 AM",
        is_read: true
      }
    ]
  }
];

const MessagesData = {
  messageUsers,
  messageConversations,
}

export default MessagesData