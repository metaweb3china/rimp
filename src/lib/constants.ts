export const boardTypes = [
  '铝板(2系)', '铝板(3系)', '铝板(5052)', '铝板(6061)',
  '冷轧板', 'BMD板', '镀锌板', '铸铝件', '镁合金', '铸镁件', '钛合金', '其他',
]

export const processSteps = [
  { key: 'degreasing', label: '脱脂', options: ['浸泡', '喷淋'] },
  { key: 'pickling', label: '酸洗', options: ['浸泡', '喷淋'] },
  { key: 'derusting', label: '中性除锈', options: ['浸泡', '喷淋'] },
  { key: 'conditioning', label: '表调', options: ['浸泡', '喷淋'] },
  { key: 'phosphating', label: '磷化', options: ['浸泡', '喷淋'] },
  { key: 'passivation', label: '钝化', options: ['浸泡', '喷淋'] },
  { key: 'electrophoresis', label: '电泳', options: [] },
]

export const reactionOptions = [
  '不反应，不冒泡', '轻微反应，轻微冒泡', '冒泡较多', '反应较剧烈，大量冒泡',
]

export const blackAshOptions = [
  '手摸无灰', '纸擦无灰', '手摸有少量灰', '纸擦少量灰',
  '手摸较多灰', '纸擦较多灰', '手摸大量灰', '纸擦大量灰',
]

export const ashColorOptions = ['黑色', '白色', '灰色', '黄色']

export const filmAppearanceOptions = [
  '均匀致密磷化膜', '粗糙磷化膜', '不均匀磷化膜',
  '无色(金属本色)', '淡黄色', '亮黄色', '金黄色', '棕黄色',
  '蓝紫色', '紫色', '蓝色', '蓝金色',
]

export const testTypes = [
  { key: 'saltSpray', label: '中性盐雾试验', fields: ['duration', 'result', 'imagePath'] },
  { key: 'cyclicCorrosion', label: '循环腐蚀', fields: ['cycleCount', 'duration', 'result', 'imagePath'] },
  { key: 'eis', label: '电化学-阻抗谱', fields: ['imagePath'] },
  { key: 'polarization', label: '电化学-极化曲线', fields: ['imagePath'] },
  { key: 'adhesion', label: '附着力', fields: ['boilingHours', 'grade', 'imagePath'] },
  { key: 'impact', label: '冲击性能', fields: ['front', 'back', 'imagePath'] },
]
