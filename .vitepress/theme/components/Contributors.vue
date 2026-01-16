<template>
  <div class="contributors-container">
    <div v-for="user in contributors" :key="user.id" class="contributor-card">
      <a :href="user.html_url" target="_blank" rel="noreferrer">
        <img :src="user.avatar_url" :alt="user.login" class="avatar" />
        <span class="username">{{ user.login }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  repo: { type: String, required: true } // 格式: "Owner/RepoName"
})

const contributors = ref([])

onMounted(async () => {
  const cacheKey = `contributors-${props.repo}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cacheTime = localStorage.getItem(`${cacheKey}-timestamp`);

  // 如果缓存存在且没超过 1 小时，直接用缓存
  if (cachedData && cacheTime && Date.now() - cacheTime < 3600000) {
    contributors.value = JSON.parse(cachedData);
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${props.repo}/contributors`);
    const data = await response.json();
    if (Array.isArray(data)) {
      const users = data.filter(user => user.type === 'User');
      contributors.value = users;
      // 存入缓存
      localStorage.setItem(cacheKey, JSON.stringify(users));
      localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString());
    }
  } catch (e) {
    console.error('获取失败', e);
  }
});
</script>

<style scoped>
.contributors-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 20px;
  margin-top: 24px;
  justify-items: center;
}

.contributor-card a {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  transition: transform 0.2s ease;
  width: 80px;
}

.contributor-card a:hover {
  transform: translateY(-5px);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-brand);
  object-fit: cover;
  background-color: var(--vp-c-bg-soft);
}

.username {
  font-size: 12px;
  margin-top: 8px;
  color: var(--vp-c-text-1);
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>