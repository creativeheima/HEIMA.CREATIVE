/** Helper gambar Unsplash. Ganti ID dengan foto milik perusahaan kapan saja. */
export function unsplash(id: string, width = 2000) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const photos = {
  team: unsplash("1522071820081-009f0129c71c"),
  teamMeeting: unsplash("1600880292203-757bb62b4baf"),
  teamLaptops: unsplash("1519389950473-47ba0277781c"),
  teamScreens: unsplash("1551434678-e076c223a692"),
  workspace: unsplash("1497366216548-37526070297c"),
  workspaceDesk: unsplash("1504384308090-c894fdcc538d"),
  circuit: unsplash("1518770660439-4636190af475"),
  network: unsplash("1451187580459-43490279c0fa"),
  analytics: unsplash("1460925895917-afdab827c52f"),
  codeLaptop: unsplash("1498050108023-c5249f4df085"),
  codeScreen: unsplash("1555066931-4365d14bab8c"),
  codeDark: unsplash("1517694712202-14dd9538aa97"),
  servers: unsplash("1558494949-ef010cbdcc31"),
  hotel: unsplash("1566073771259-6a8506099945"),
  mobile: unsplash("1512941937669-90a1b58e7e9c"),
  building: unsplash("1486406146926-c627a92ad1ab"),
  laptopTech: unsplash("1531297484001-80022131f5a1"),
  consulting: unsplash("1542744173-8e7e53415bb0"),
  engineer: unsplash("1573164713714-d95e436ab8d6"),
  planning: unsplash("1553877522-43269d4ea984"),
  // Foto ilustrasi project klien — ganti dengan screenshot sistem asli bila tersedia
  construction: unsplash("1541888946425-d81bb19240f5"),
  constructionCrew: unsplash("1504307651254-35680f356dfd"),
  engineeringPlan: unsplash("1581092160562-40aa08e78837"),
  hotelNight: unsplash("1542314831-068cd1dbfeeb"),
  hotelResort: unsplash("1551882547-ff40c63fe5fa"),
  inventory: unsplash("1587293852726-70cdb56c2866"),
  invoice: unsplash("1554224155-6726b3ff858f"),
  cafe: unsplash("1554118811-1e0d58224f24"),
  cafeSign: unsplash("1501339847302-ac426a4a7cbb"),
  coffee: unsplash("1495474472287-4d71bcdd2085"),
  latte: unsplash("1509042239860-f550ce710b93"),
  acTechnician: unsplash("1621905251189-08b45d6a269e"),
  supportTeam: unsplash("1531482615713-2afd69097998"),
  contactUs: unsplash("1596524430615-b46475ddff6e"),
} as const;
