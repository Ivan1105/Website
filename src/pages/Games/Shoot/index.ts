import * as zrender from 'zrender';
import CanvasPainter from 'zrender/lib/canvas/Painter'
zrender.registerPainter('canvas', CanvasPainter)

export { zrender }
export * from './Const';
export * from './Bullet';
export * from './Character';