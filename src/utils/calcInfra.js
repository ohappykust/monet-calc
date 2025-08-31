export function calcInfra(params) {
  const {
    mau = 0,
    peakPercent = 0,
    reqsPerUserPerDay = 0,
    avgResponseMs = 150,
    reqsPerCore = 50,
    vcpusPerInstance = 4,
    ramPerInstance = 8,
    costPerInstance = 12000,
    dataPerUserMB = 5,
    storageOverheadPct = 40,
    costPerGB = 10,
    redisUsersPct = 10,
    ramPerRedisUserKB = 50,
    costRedisPerGB = 3000,
  } = params || {}

  const mauVal = parseFloat(mau) || 0
  const peakPct = (parseFloat(peakPercent) || 0) / 100
  const peakConcurrent = Math.max(1, Math.round(mauVal * peakPct))
  const reqsPerUser = parseFloat(reqsPerUserPerDay) || 0
  const avgResp = parseFloat(avgResponseMs) || 150
  const reqsCore = parseFloat(reqsPerCore) || 50
  const vcpus = parseInt(vcpusPerInstance) || 4
  const ram = parseFloat(ramPerInstance) || 8
  const costInst = parseFloat(costPerInstance) || 12000

  const totalDailyReqs = mauVal * reqsPerUser
  const avgRPS = totalDailyReqs / 86400
  const peakRPS = Math.max(1, Math.round(peakConcurrent * 0.1 * 10))
  const burstFactor = 5
  const peakRPS2 = Math.max(peakRPS, Math.round(avgRPS * burstFactor))

  const requiredCores = Math.ceil(peakRPS2 / reqsCore)
  const instancesNeeded = Math.ceil(requiredCores / vcpus)

  const dataMB = parseFloat(dataPerUserMB) || 5
  const overhead = parseFloat(storageOverheadPct) || 40
  const totalStorageGB = Math.ceil((mauVal * dataMB) / 1024 * (1 + overhead / 100))

  const diskCostPerGB = parseFloat(costPerGB) || 10
  const storageCost = Math.round(totalStorageGB * diskCostPerGB)

  const redisPct = (parseFloat(redisUsersPct) || 0) / 100
  const ramPerUserKB = parseFloat(ramPerRedisUserKB) || 50
  const totalRedisKB = Math.ceil(mauVal * redisPct * ramPerUserKB)
  const totalRedisGB = Math.max(0.1, totalRedisKB / 1024 / 1024)
  const redisGBPrice = parseFloat(costRedisPerGB) || 3000
  const redisCost = Math.ceil(totalRedisGB) * redisGBPrice

  const avgPayloadKB = 50
  const monthlyBandwidthGB = Math.ceil((totalDailyReqs * avgPayloadKB * 30) / 1024 / 1024)

  const infraCostInstances = instancesNeeded * costInst
  const estimatedMonthlyInfra = infraCostInstances + storageCost + redisCost

  const replicas = totalStorageGB > 50 ? 1 : 0

  return {
    mau: mauVal,
    peakConcurrent,
    totalDailyReqs,
    avgRPS: Math.round(avgRPS * 100) / 100,
    peakRPS: peakRPS2,
    requiredCores,
    instancesNeeded,
    vcpusPerInstance: vcpus,
    ramPerInstance: ram,
    totalStorageGB,
    storageCost,
    totalRedisGB: Math.round(totalRedisGB * 100) / 100,
    redisCost,
    monthlyBandwidthGB,
    infraCostInstances,
    estimatedMonthlyInfra,
    replicas,
  }
}
