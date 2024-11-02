import React, { useEffect, useState } from 'react';

const Referee: React.FC = () => {
  const [localStorageInfo, setLocalStorageInfo] = useState<{ used?: number; quota?: number }>({});

  useEffect(() => {
    const checkLocalStorageSpace = () => {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage.getItem(key);
          if (value) used += value.length * 2; // Each character is ~2 bytes
        }
      }

      // Estimate the quota based on the common 5MB limit for localStorage
      const quota = 5 * 1024 * 1024; // 5 MB in bytes

      setLocalStorageInfo({ used, quota });
    };

    checkLocalStorageSpace();
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div>
      <h2>Local Storage Information</h2>
      {localStorageInfo.quota !== undefined ? (
        <ul>
          <li>Total quota: {formatBytes(localStorageInfo.quota)}</li>
          <li>Used space: {formatBytes(localStorageInfo.used || 0)}</li>
          <li>Free space: {formatBytes((localStorageInfo.quota || 0) - (localStorageInfo.used || 0))}</li>
        </ul>
      ) : (
        <p>Unable to retrieve local storage information.</p>
      )}
    </div>
  );
};

export default Referee;
