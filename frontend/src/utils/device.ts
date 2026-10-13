// Utility for device identification and concurrent session management

export function getDeviceId(): string {
  let id = localStorage.getItem('meil_device_id');
  if (!id) {
    id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('meil_device_id', id);
  }
  return id;
}

export function getDeviceDetails(): { deviceId: string; deviceName: string } {
  const deviceId = getDeviceId();
  const ua = navigator.userAgent;

  let platform = 'Desktop PC';
  if (/android/i.test(ua)) {
    platform = 'Android Mobile';
  } else if (/iphone/i.test(ua)) {
    platform = 'Apple iPhone';
  } else if (/ipad/i.test(ua)) {
    platform = 'Apple iPad';
  } else if (/windows/i.test(ua)) {
    platform = 'Windows PC';
  } else if (/macintosh/i.test(ua)) {
    platform = 'Apple Mac';
  } else if (/linux/i.test(ua)) {
    platform = 'Linux PC';
  }

  let browser = 'Browser';
  if (ua.includes('Edg/')) {
    browser = 'Edge';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Chrome';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browser = 'Safari';
  } else if (ua.includes('Firefox/')) {
    browser = 'Firefox';
  }

  return {
    deviceId,
    deviceName: `${platform} • ${browser}`,
  };
}
