<template>
  <div class="signal-artwork" aria-hidden="true">
    <div class="orbit orbit-outer"></div>
    <div class="orbit orbit-inner"></div>
    <div class="signal-disc">
      <span class="disc-label">TEN THOUSAND STARS</span>
      <span class="disc-number">01<span> / </span></span>
      <div class="waveform">
        <span v-for="(height, index) in wave" :key="index" :style="{ height: `${height}%` }"></span>
      </div>
      <span class="disc-caption">ハジメテノオト</span>
    </div>
    <span class="orbit-point point-one"></span>
    <span class="orbit-point point-two"></span>
    <span class="artwork-note">HASTUNE MIKU · 39</span>
    <span class="artwork-cross">＋</span>
  </div>
</template>

<script setup lang="ts">
const wave = [15, 24, 36, 24, 48, 67, 43, 77, 100, 66, 43, 63, 85, 59, 35, 50, 29, 19, 30]
</script>

<style scoped>
.signal-artwork {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  isolation: isolate;
  container-type: inline-size;
  overflow: clip;
}

.signal-artwork::before {
  content: '';
  position: absolute;
  inset: 4%;
  border-radius: 50%;
  background: radial-gradient(circle, #d7f4ee 0%, #e6f8f3 50%, transparent 72%);
  z-index: -1;
}

.orbit {
  position: absolute;
  border: 1px solid var(--site-border);
  border-radius: 50%;
}

.orbit-outer {
  inset: 5%;
  transform: rotate(-24deg) scaleY(0.88);
}

.orbit-inner {
  inset: 12%;
  border-style: dashed;
  transform: rotate(24deg) scaleY(1.1);
}

.signal-disc {
  width: 70%;
  aspect-ratio: 1;
  border: 1px solid #fff;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffffffed, #eaf8f1);
  box-shadow: 0 24px 70px rgb(45 132 119 / 10%), inset 0 0 0 10px rgb(255 255 255 / 45%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.disc-label {
  color: var(--site-accent);
  font-size: clamp(8px, 2.2cqw, 10px);
  letter-spacing: 0.18em;
}

.disc-number {
  font-size: clamp(44px, 17cqw, 84px);
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.06em;
  color: var(--site-accent);
}

.disc-number span {
  color: var(--site-primary);
  font-weight: 200;
}

.waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(3px, 1cqw, 5px);
  width: 60%;
  height: clamp(28px, 10cqw, 48px);
  margin: 10px 0 12px;
}

.waveform span {
  flex: 1;
  max-width: 5px;
  background: var(--site-primary);
  border-radius: 3px;
}

.disc-caption {
  color: var(--site-muted);
  font-size: clamp(9px, 2.5cqw, 12px);
}

.orbit-point {
  position: absolute;
  border: 5px solid var(--site-bg);
  border-radius: 50%;
  background: var(--site-primary);
}

.point-one {
  top: 17%;
  right: 13%;
  width: 24px;
  height: 24px;
}

.point-two {
  bottom: 15%;
  left: 14%;
  width: 17px;
  height: 17px;
}

.artwork-note {
  position: absolute;
  bottom: 0;
  left: 5%;
  color: var(--site-accent);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.artwork-cross {
  position: absolute;
  right: 0;
  bottom: 20%;
  color: var(--site-accent);
  font-size: 25px;
  font-weight: 300;
}
</style>
