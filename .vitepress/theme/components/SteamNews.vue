<script setup>
import { ref, reactive, onMounted } from 'vue'

const articles = ref([])
const loading = ref(true)

const APP_ID = '457140'

// Tooltip 相关状态
const tooltip = reactive({
  visible: false,
  lines: [],
  style: {}
})

// 解析 Steam 补丁说明为纯文本行数组
function parseSteamDescription(html) {
  if (!html) return []

  return html
    .replace(/\r?\n/g, '')
    .replace(/<li>(.*?)<\/li>/gi, '• $1\n')
    .replace(/<\/p>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
}

// 显示 Tooltip
function showTooltip(e, item) {
  const rect = e.currentTarget.getBoundingClientRect()

  const MAX_LINES = 10
  const GAP = 12
  const WIDTH = 700
  const LINE_HEIGHT = 22
  const PADDING = 24

    const total = item.parsedLines.length

    if (total > MAX_LINES) {
        tooltip.lines = [
            ...item.parsedLines
            .slice(0, MAX_LINES - 1)
            .map(t => ({ text: t })),
            { text: '......', ellipsis: true }
        ]
    } else {
        tooltip.lines = item.parsedLines.map(t => ({ text: t }))
    }




  cost estimatedHeight =
    tooltip.lines.length * LINE_HEIGHT + PADDING

  let top

  // 优先显示在上方
  if (rect.top < estimatedHeight + GAP) {
    top = rect.bottom + GAP
  } else {
    top = rect.top - estimatedHeight - GAP
  }

  tooltip.style = {
    position: 'fixed',
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${WIDTH}px`
  }

  tooltip.visible = true
}

function hideTooltip() {
  tooltip.visible = false
}


// 获取 Steam 新闻数据
onMounted(async () => {
  try {
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fstore.steampowered.com%2Ffeeds%2Fnews%2Fapp%2F${APP_ID}`
    )
    const data = await res.json()

    if (data.status === 'ok') {
      articles.value = data.items.slice(0, 10).map(item => {
        const imgReg = /<img.*?src=["'](.*?)["']/
        const match = item.content?.match(imgReg)

        const fallbackImg =
          `https://cdn.akamai.steamstatic.com/steam/apps/${APP_ID}/header.jpg`

        return {
          ...item,
          displayImage: (match ? match[1] : item.thumbnail) || fallbackImg,
          displayDate: item.pubDate.split(' ')[0],
          parsedLines: parseSteamDescription(item.description)
        }
      })
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>




<tempate>
  <div class="steam-container">
    <div v-if="loading" class="loading">
      正在同步 Steam 补丁说明...
    </div>

    <div v-else class="news-list">
      <a
        v-for="item in articles"
        :key="item.guid"
        :href="item.link"
        target="_blank"
        class="news-card"
        @mouseenter="e => showTooltip(e, item)"
        @mouseleave="hideTooltip"
      >
        <div class="news-card-inner">
          <div class="card-text">
            <div class="card-header">
              <span class="tag">游戏更新</span>
              <span class="date">{{ item.displayDate }}</span>
            </div>

            <h3 class="title">{{ item.title }}</h3>

            <p class="description">
              {{ item.parsedLines.join(' ').slice(0, 60) }}...
            </p>
          </div>

          <div class="card-image-box">
            <img :src="item.displayImage" />
          </div>
        </div>
      </a>
    </div>

    <Teleport to="body">
      <div
        v-if="tooltip.visible"
        class="global-tooltip"
        :style="tooltip.style"
      >
        <div
        v-for="(line, i) in tooltip.lines"
            :key="i"
            class="tooltip-line"
            :class="{
                bullet: line.text.startsWith('•'),
                ellipsis: line.ellipsis
            }"
            >
            {{ line.text }}
        </div>

      </div>
    </Teleport>
  </div>
</template>






<style scoped>

.news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-card {
  text-decoration: none;
  color: inherit;
}

.news-card-inner {
  display: flex;
  justify-content: space-between;
  background: #2a313d;
  border: 1px solid #535a66;
  border-radius: 4px;
  transition: transform 0.2s, background 0.2s;
}

.news-card:hover .news-card-inner {
  background: #363f4c;
  transform: translateX(4px);
}



.card-text {
  padding: 1rem;
}

.card-header {
  font-size: 12px;
  display: flex;
  gap: 10px;
}

.tag {
  color: #8f98a0;
}

.date {
  color: #66c0f4;
}

.title {
  margin: 6px 0 0;
  font-size: 1.1rem;
  color: #fff;
}

.description {
  font-size: 0.85rem;
  color: #acb2b8;
}



.card-image-box {
  width: 200px;
  height: 112px;
  margin: 0.75rem;
  overflow: hidden;
  border-radius: 4px;
}

.card-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}



.global-tooltip {
  background: rgba(18, 22, 28, 0.96);
  border: 1px solid #3d4450;
  border-radius: 4px;
  padding: 12px;
  width: 700px;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  z-index: 9999999;

  pointer-events: none;
}

.tooltip-line {
  font-size: 0.8rem;
  color: #dcdedf;
  line-height: 1.45;
  margin-bottom: 6px;
}

.tooltip-line.bullet {
  padding-left: 14px;
  text-indent: -14px;
  color: #c7d5e0;
}

.tooltip-line.ellipsis {
  color: #66c0f4;
  font-weight: 500;
}



</style>
