import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

// Hook useGetCallById untuk mendapatkan panggilan berdasarkan ID
export const useGetCallById = (id: string | string[]) => {
  // State untuk menyimpan data panggilan
  const [call, setCall] = useState<Call>();

  // State untuk menandakan apakah panggilan sedang dimuat
  const [isCallLoading, setIsCallLoading] = useState(true);
  // Menggunakan hook useStreamVideoClient untuk mendapatkan klien Stream
  const client = useStreamVideoClient();

  // Menggunakan useEffect untuk memuat panggilan saat klien atau ID berubah
  useEffect(() => {
    // Jika klien tidak tersedia, hentikan eksekusi
    if (!client) return;

    const loadCall = async () => {
      // Memuat panggilan dari klien berdasarkan ID
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id,
        },
      });

      // Jika panggilan ditemukan, set panggilan pertama ke dalam state
      if (calls.length > 0) setCall(calls[0]);
      setIsCallLoading(false); // Mengubah status menjadi tidak sedang dimuat setelah selesai
    };

    loadCall(); // Memanggil fungsi untuk memuat panggilan
  }, [client, id]); // Bergantung pada klien dan ID

  // Mengembalikan panggilan dan status pengambilan panggilan
  return { call, isCallLoading };
};
