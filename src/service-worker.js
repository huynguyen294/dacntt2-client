/* eslint-disable no-undef */
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

// Đăng ký một route để xử lý yêu cầu GET đến tất cả các tệp tài nguyên
// những request không có destination là data được handle với indexedDB không cần cache request đó
// Sử dụng chiến lược NetworkFirst để thực hiện yêu cầu mạng, nhưng nếu không thành công, thì sử dụng cache
registerRoute(
  ({ request }) => request.method === "GET" && request.destination && request.url !== `${request.referrer}favicon.ico`,
  new NetworkFirst()
);

// cleanup Outdated Caches
cleanupOutdatedCaches();

// pre cache And Route
precacheAndRoute(self.__WB_MANIFEST);

// skipWaiting
self.skipWaiting();
//clientsClaim
clientsClaim();

// notification
self.addEventListener("push", async (e) => {
  const { title, body } = JSON.parse(e.data.text());
  e.waitUntil(self.registration.showNotification(title, { body, icon: "/icon.png" }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // This looks to see if the current window is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
      })
  );
});
