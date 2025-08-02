async function apiFetch(path, options = {}) {
  const base = document.getElementById('api-base').value.replace(/\/$/, '');
  const res = await fetch(base + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

async function loadFarms() {
  try {
    const farms = await apiFetch('/api/farms');
    const tbody = document.getElementById('farm-list');
    tbody.innerHTML = '';
    farms.forEach(farm => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${farm.name}</td>
        <td>${farm.replicas}</td>
        <td>${farm.image}</td>
        <td>
          <button data-name="${farm.name}" class="scale-up">+1</button>
          <button data-name="${farm.name}" class="scale-down">-1</button>
          <button data-name="${farm.name}" class="upgrade">Upgrade</button>
        </td>`;
      tbody.appendChild(row);
    });
  } catch (err) {
    alert('Failed to load farms: ' + err.message);
  }
}

async function createFarm() {
  const name = document.getElementById('farm-name').value.trim();
  const image = document.getElementById('farm-image').value.trim();
  const replicas = parseInt(document.getElementById('farm-replicas').value, 10);
  if (!name) return alert('Name required');
  try {
    await apiFetch('/api/farms', {
      method: 'POST',
      body: JSON.stringify({ name, image, replicas }),
    });
    document.getElementById('farm-name').value = '';
    loadFarms();
  } catch (err) {
    alert('Create failed: ' + err.message);
  }
}

async function scaleFarm(name, delta) {
  try {
    await apiFetch(`/api/farms/${encodeURIComponent(name)}/scale`, {
      method: 'POST',
      body: JSON.stringify({ delta }),
    });
    loadFarms();
  } catch (err) {
    alert('Scale failed: ' + err.message);
  }
}

async function upgradeFarm(name) {
  const image = prompt('New container image:');
  if (!image) return;
  try {
    await apiFetch(`/api/farms/${encodeURIComponent(name)}/upgrade`, {
      method: 'POST',
      body: JSON.stringify({ image }),
    });
    loadFarms();
  } catch (err) {
    alert('Upgrade failed: ' + err.message);
  }
}

document.getElementById('refresh-btn').addEventListener('click', loadFarms);
document.getElementById('create-btn').addEventListener('click', createFarm);

document.getElementById('farm-list').addEventListener('click', (e) => {
  const name = e.target.dataset.name;
  if (!name) return;
  if (e.target.classList.contains('scale-up')) {
    scaleFarm(name, 1);
  } else if (e.target.classList.contains('scale-down')) {
    scaleFarm(name, -1);
  } else if (e.target.classList.contains('upgrade')) {
    upgradeFarm(name);
  }
});

// Initial load
loadFarms();
