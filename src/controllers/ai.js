const { fetchMySQLData } = require("../models/ai");
const axios = require("axios");
const cache = require("node-cache");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const dbPool = require("../config/database");

const myCache = new cache({ stdTTL: 100, checkperiod: 120 });

async function getAIRecommendations(data, pelajaran, judul, kelas, Bab, tujuanPembelajaran, waktuPerPertemuan, jumlahPertemuan, retryCount = 0) {
  const cacheKey = `${pelajaran}-${judul}-${kelas}-${Bab}-${tujuanPembelajaran}-${waktuPerPertemuan}-${jumlahPertemuan}`;
  const cachedResponse = myCache.get(cacheKey);

  if (cachedResponse) {
    return cachedResponse;
  }

  const limitedData = data.currentYear.slice(0, 10);

  const avgNilai = data.currentYear.reduce((sum, row) => sum + row.avg_nilai, 0) / data.currentYear.length;
  const avgKehadiran = data.currentYear.reduce((sum, row) => sum + row.avg_kehadiran_percentage, 0) / data.currentYear.length;
  const avgAktif = data.currentYear.reduce((sum, row) => sum + row.avg_aktif_percentage, 0) / data.currentYear.length;
  const overallAvg = data.currentYear.reduce((sum, row) => sum + row.overall_avg, 0) / data.currentYear.length;
  const metodeSebelumnya = data.currentYear[0]?.metode || "Belum ditentukan"; // Get the previous method

  const createSessionDetail = (sessionNumber) => {
    const activity1Time = Math.floor(waktuPerPertemuan * 0.25);
    const activity2Time = Math.floor(waktuPerPertemuan * 0.5);
    const activity3Time = waktuPerPertemuan - activity1Time - activity2Time;
    return `
      Pertemuan ${sessionNumber}:
      Tempat: 
      Alat dan bahan: 
      Kegiatan:
      - Kegiatan 1: [Deskripsi kegiatan 1] (${activity1Time} menit)
      - Kegiatan 2: [Deskripsi kegiatan 2] (${activity2Time} menit)
      - Kegiatan 3 (opsional): [Deskripsi kegiatan 3] (${activity3Time} menit)
    `;
  };

  const prompt = `
    Based on the following student data for grades, attendance, and activeness:
    ${JSON.stringify(limitedData)}

    Mata pelajaran: ${pelajaran}
    Judul: ${judul}
    Kelas: ${kelas}
    Bab: ${Bab}
    Tujuan Pembelajaran: ${tujuanPembelajaran}
    Waktu Per Pertemuan: ${waktuPerPertemuan} menit
    Jumlah Pertemuan: ${jumlahPertemuan}
    
    Rata-rata Nilai: ${avgNilai.toFixed(2)}
    Rata-rata Kehadiran: ${avgKehadiran.toFixed(2)}
    Rata-rata Keakktifan: ${avgAktif.toFixed(2)}
    Metode Sebelumnya: ${metodeSebelumnya}

    Provide detailed lesson plans and recommendations for the following teaching models:
    - Think, Pair, Share (TPS)
    - Jigsaw Learning
    - Project Based Learning
    - Problem Based Learning

    For each teaching model, provide a detailed plan for ${jumlahPertemuan} sessions. Include specific steps, materials needed, place (classroom or outdoors), and breakdown of activities within a total time of ${waktuPerPertemuan} minutes per session.

    Format the recommendations as follows:
     Mata pelajaran: ${pelajaran}
    Judul: ${judul}
    Kelas: ${kelas}
    Bab: ${Bab}
    Tujuan Pembelajaran: ${tujuanPembelajaran}
    Waktu Per Pertemuan: ${waktuPerPertemuan} menit
    Jumlah Pertemuan: ${jumlahPertemuan}
    Rata-rata Nilai: ${avgNilai.toFixed(2)}
    Metode Sebelumnya: ${metodeSebelumnya}

    1. Think, Pair, Share (TPS):
    Berikut ini adalah detail pembelajaran ${judul} untuk setiap pertemuan:
    ${Array.from({ length: jumlahPertemuan }, (_, i) => createSessionDetail(i + 1)).join("\n")}

    2. Jigsaw Learning:
    Berikut ini adalah detail pembelajaran ${judul} untuk setiap pertemuan:
    ${Array.from({ length: jumlahPertemuan }, (_, i) => createSessionDetail(i + 1)).join("\n")}

    3. Project Based Learning:
    Berikut ini adalah detail pembelajaran ${judul} untuk setiap pertemuan:
    ${Array.from({ length: jumlahPertemuan }, (_, i) => createSessionDetail(i + 1)).join("\n")}

    4. Problem Based Learning:
    Berikut ini adalah detail pembelajaran ${judul} untuk setiap pertemuan:
    ${Array.from({ length: jumlahPertemuan }, (_, i) => createSessionDetail(i + 1)).join("\n")}

   Berdasarkan data dan mempertimbangkan mata pelajaran "${pelajaran}", saya merekomendasikan model pengajaran berikut:
   [MASUKKAN MODEL YANG DIREKOMENDASIKAN DI SINI]
   Alasan untuk rekomendasi ini:
    1. Penjelasan mengapa model ini cocok untuk meningkatkan nilai siswa, kehadiran, dan aktifitas.
    2. Bagaimana model ini sesuai dengan mata pelajaran dan tujuan pembelajaran.
    3. Strategi khusus dalam model ini yang dapat meningkatkan keterlibatan dan pemahaman.

  `;

  console.log("Prompt sent to OpenAI API:", prompt);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo-16k",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 5000,
      },
      { headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );

    console.log("AI Response:", response.data);

    let aiContent = response.data.choices[0].message.content;

    const recommendedModelIndex = aiContent.indexOf("Recommended Teaching Model:");
    const recommendations = aiContent.substring(0, recommendedModelIndex).trim();
    const recommendedModel = aiContent.substring(recommendedModelIndex).trim();

    const result = { recommendations, recommendedModel };
    myCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error("Error with AI API:", error.message);
    if (error.response) {
      console.error("Error Response Data:", error.response.data);
    }
    if (error.response?.status === 429) {
      if (retryCount < 5) {
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.error(`Rate limit exceeded. Waiting for ${waitTime / 1000} seconds before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return getAIRecommendations(data, pelajaran, judul, kelas, Bab, tujuanPembelajaran, totalWaktu, retryCount + 1);
      } else {
        console.error("Max retry attempts reached. Please try again later.");
        return null;
      }
    } else {
      return null;
    }
  }
}

async function postRecommendations(req, res) {
  const { pelajaran, judul, kelas, Bab, tujuanPembelajaran, waktuPerPertemuan, jumlahPertemuan } = req.body; // Ensure 'Bab' and 'judul' are used

  console.log("Received request with Bab:", Bab, "judul:", judul, "pelajaran:", pelajaran);

  const data = await fetchMySQLData(Bab, judul); // Fetch data based on Bab and judul
  console.log("Fetched Data:", data); // Log fetched data
  if (!data.currentYear || data.currentYear.length === 0) {
    res.status(500).send("Error fetching data or no data found for current year"); //kalau tidak ada data yang diambil maka hasilnya akan error
    return;
  }

  const aiResult = await getAIRecommendations(data, pelajaran, judul, kelas, Bab, tujuanPembelajaran, waktuPerPertemuan, jumlahPertemuan); // Ensure 'Bab' and 'judul' are used
  if (!aiResult) {
    res.status(500).send("Error generating AI recommendations");
    return;
  }

  res.send({
    recommendations: aiResult.recommendations,
    recommendedModel: aiResult.recommendedModel,
  });
}

// Function to fetch and log data in tables
async function fetchTestData() {
  const connection = await dbPool.getConnection();

  const [modulAjarRows] = await connection.execute("SELECT * FROM modul_ajar");
  const [nilaiRows] = await connection.execute("SELECT * FROM nilai");
  const [kehadiranRows] = await connection.execute("SELECT * FROM kehadiran");

  // console.log("Modul Ajar:", modulAjarRows);
  // console.log("Nilai:", nilaiRows);
  // console.log("Kehadiran:", kehadiranRows);
  console.log("Logging Success");
}

// Call the function to fetch and log data in tables
fetchTestData().catch(console.error);

module.exports = {
  postRecommendations,
};
