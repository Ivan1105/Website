<template>
  <div class="home-page">
    <section class="site-container home-hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow hero-eyebrow"><span></span>みくみくにしてあげる♪</p>
        <h1 id="home-title">探索未知的世界<span class="title-dot">.</span></h1>
        <p class="hero-tagline">梦想与奇迹，<br>皆有可能发生。</p>
        <p class="hero-description">这里是我的个人网站。<br>记录视觉创作与生活灵感，也探索数字世界的更多可能。</p>
        <div class="hero-actions">
          <v-btn to="/chatbox" color="primary" size="large" append-icon="mdi-arrow-top-right">智能体对话</v-btn>
          <v-btn to="/account" variant="text" color="secondary" size="large">个人中心 <v-icon end size="18">mdi-arrow-right</v-icon></v-btn>
        </div>
        <div class="hero-footnote"><span aria-hidden="true">01 /</span> 一点灵感，一次新的对话。</div>
      </div>
      <SignalArtwork class="hero-artwork" />
    </section>
    <section class="site-container explore-section" aria-labelledby="explore-title">
      <div class="section-heading"><div><p class="eyebrow">EXPLORE / 探索</p><h2 id="explore-title">从这里开始</h2></div><p class="muted">尝试这些功能，开始你的探索。</p></div>
      <div class="entry-grid">
        <nuxt-link to="/chatbox" class="entry-card entry-chat">
          <span class="entry-icon"><v-icon icon="mdi-chat-processing-outline" size="25" /></span>
          <div><span class="entry-label">CHAT / 聊天</span><h3>聊聊你的新想法</h3><p>选择一个会话，开始交流与探索。</p></div>
          <span class="entry-arrow" aria-hidden="true">↗</span>
        </nuxt-link>
        <nuxt-link to="/account" class="entry-card">
          <span class="entry-icon"><v-icon icon="mdi-account-outline" size="25" /></span>
          <div><span class="entry-label">ACCOUNT / 账户</span><h3>欢迎回来</h3><p>登录账户，继续你的对话。</p></div>
          <span class="entry-arrow" aria-hidden="true">↗</span>
        </nuxt-link>
      </div>
    </section>
    <footer class="site-container home-footer">
      <span class="footer-signature">Ivan1105<span>.</span><small>愛されなくても君がいる</small></span>
      <div class="copyright"><p>闽公网安备 35032202000179号</p><p>Copyright &copy; 2021 - 2026 Ivan. All Rights Reserved.</p></div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Ivan1105 · 个人空间', description: '视觉创作、灵感记录与数字实验的个人空间。' })
</script>

<style scoped>
.home-page {
  background: radial-gradient(ellipse at 90% 5%, #e8f7ef 0, transparent 48%);
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  align-items: center;
  gap: 40px;
  padding-block: 72px 64px;
  min-height: 580px;
}

.hero-copy {
  min-width: 0;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 26px;
  font-size: 0.68rem;
}

.hero-eyebrow > span {
  width: 7px;
  height: 7px;
  background: var(--site-accent);
  border-radius: 50%;
}

.hero-copy h1 {
  font-size: clamp(2rem, 3.8vw, 3.4rem);
  letter-spacing: -0.045em;
  line-height: 1.3;
  font-weight: 650;
}

.hero-copy h1 > span:first-child {
  white-space: nowrap;
}

.title-dot {
  color: var(--site-accent);
}

.hero-tagline {
  margin-top: 20px;
  font-size: clamp(1.65rem, 3vw, 2.5rem);
  line-height: 1.5;
  font-weight: 350;
  letter-spacing: -0.035em;
}

.hero-description {
  margin-top: 22px;
  color: var(--site-muted);
  font-size: 0.94rem;
  line-height: 1.95;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero-actions .v-btn {
  height: 48px;
  padding-inline: var(--site-space-3);
  font-size: 0.9rem;
}

.hero-footnote {
  margin-top: 34px;
  color: var(--site-muted);
  font-size: 0.75rem;
}

.hero-footnote > span {
  color: var(--site-accent);
  font-family: var(--font-mono);
  margin-right: 14px;
}

.hero-artwork {
  justify-self: end;
  min-width: 0;
}

.explore-section {
  padding-block: 28px 64px;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--site-space-3);
  margin-bottom: var(--site-space-3);
}

.section-heading .eyebrow {
  font-size: 0.65rem;
  margin-bottom: var(--site-space-1);
}

.section-heading h2 {
  font-size: 1.45rem;
  font-weight: 650;
}

.section-heading > p {
  font-size: 0.82rem;
}

.entry-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 20px;
}

.entry-card {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px;
  border: 1px solid var(--site-border);
  border-radius: var(--site-card-radius);
  color: var(--site-text);
  text-decoration: none;
  background: var(--site-surface);
  transition: border-color var(--site-transition), transform var(--site-transition), box-shadow var(--site-transition);
}

.entry-chat {
  background: linear-gradient(110deg, #e5f6f0, #f1fbf5);
}

.entry-card:hover {
  transform: translateY(-3px);
  border-color: var(--site-accent);
  box-shadow: var(--site-shadow);
}

.entry-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border: 1px solid var(--site-border);
  border-radius: 16px;
  color: var(--site-accent);
  background: white;
}

.entry-label {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--site-accent);
}

.entry-card h3 {
  font-size: 1.1rem;
  margin-block: 4px 6px;
  font-weight: 650;
}

.entry-card p {
  font-size: 0.82rem;
  color: var(--site-muted);
}

.entry-arrow {
  margin-left: auto;
  align-self: flex-start;
  font-size: 22px;
  color: var(--site-accent);
}

.home-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--site-space-3);
  padding-block: 28px;
  border-top: 1px solid var(--site-border);
}

.footer-signature {
  font-size: 1rem;
  font-weight: 700;
}

.footer-signature > span {
  color: var(--site-accent);
}

.footer-signature small {
  margin-left: 18px;
  color: var(--site-muted);
  font-size: 0.7rem;
  font-weight: 400;
}

.copyright {
  text-align: right;
  color: var(--site-muted);
  font-size: 0.65rem;
  line-height: 1.9;
}

@media (max-width: 960px) {
  .home-hero {
    gap: var(--site-space-2);
    min-height: 520px;
    padding-block: 56px;
  }
  .entry-card {
    padding: var(--site-space-3);
    gap: 14px;
  }
  .entry-icon {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 700px) {
  .home-hero {
    grid-template-columns: 1fr;
    padding-block: 44px 30px;
    gap: 12px;
  }
  .home-hero .hero-artwork {
    width: 280px;
    justify-self: center;
    margin-top: var(--site-space-2);
  }
  .hero-copy h1 {
    font-size: clamp(2rem, 7.5vw, 2.8rem);
  }
  .hero-tagline {
    font-size: 1.85rem;
  }
  .hero-eyebrow {
    margin-bottom: 20px;
  }
  .section-heading {
    display: block;
  }
  .section-heading > p {
    margin-top: var(--site-space-1);
  }
  .entry-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .entry-card {
    padding: 24px 20px;
  }
  .explore-section {
    padding-bottom: 40px;
  }
  .home-footer {
    align-items: start;
    flex-direction: column;
    gap: var(--site-space-2);
  }
  .copyright {
    text-align: left;
  }
}
</style>
