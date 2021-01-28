import { DATA_URL } from '../common'
const lastUpdateUrl = `${DATA_URL}.json`

export const setLastUpdateDB = () => {
  const date = new Date()
  const payload = {
    lastUpdate: date
  }
  return fetch(lastUpdateUrl, {
    method: "PATCH",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(() => {
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

export const setLastUpdateCache = async () => {
  const cache = await caches.open("ffl-cache");
  cache.add(`${DATA_URL}lastUpdate.json`);
  return
} 
