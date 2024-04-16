"use client";

import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";

// Komponen Meeting dengan parameter id untuk menampilkan ruang pertemuan
const Meeting = ({ params: { id } }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser(); // Menggunakan hook useUser untuk mendapatkan informasi pengguna
  const [isSetUpComplete, setIsSetUpComplete] = useState(false); // State untuk menandakan apakah persiapan pertemuan sudah selesai
  // Menggunakan hook useGetCallById untuk mendapatkan panggilan berdasarkan ID
  const { call, isCallLoading } = useGetCallById(id);

  // Jika data pengguna atau panggilan belum dimuat, tampilkan indikator loading
  if (!isLoaded || !isCallLoading) return <Loader />;

  // Mengembalikan tampilan utama
  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetUpComplete ? <MeetingSetup /> : <MeetingRoom />}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
