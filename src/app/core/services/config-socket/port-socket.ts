// export const CODE_COMPILER_SOCKET = 'http://localhost:4098';
// export const CONVERSATION_CHAT_SOCKET = 'http://localhost:4099';
// export const NOTIFICATION_SOCKET_PORT = 'http://localhost:4101';

import { environment } from '../../../../environments/environment';

const loc = window.location;
const isHttps = loc.protocol === 'https:';
const WS_SCHEME = isHttps ? 'wss' : 'ws';
const SAME_ORIGIN_WS_BASE = `${WS_SCHEME}://${loc.host}`;

// Khi dev localhost, vẫn cho nối thẳng tới service
const DEV = {
  code:  `${WS_SCHEME}://localhost:4098`,
  chat:  `${WS_SCHEME}://localhost:4099`,
  notify:`${WS_SCHEME}://localhost:4101`,
};

// Production đi qua Nginx bridge: /ws/{...}
export const CODE_COMPILER_SOCKET = environment.production
  ? `${SAME_ORIGIN_WS_BASE}/ws/code`
  : DEV.code;

export const CONVERSATION_CHAT_SOCKET = environment.production
  ? `${SAME_ORIGIN_WS_BASE}/ws/chat`
  : DEV.chat;

export const NOTIFICATION_SOCKET_PORT = environment.production
  ? `${SAME_ORIGIN_WS_BASE}/ws/notify`
  : DEV.notify;
