"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const EndCallButton = () => {
  const router = useRouter(); // Menggunakan useRouter untuk mendapatkan objek router

  const call = useCall(); // Menggunakan useCall untuk mendapatkan panggilan saat ini

  if (!call)
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );

  const { useLocalParticipant } = useCallStateHooks(); // Menggunakan useCallStateHooks untuk mendapatkan data status panggilan
  const localParticipant = useLocalParticipant(); // Mendapatkan data partisipan lokal

  const isMeetingOwner =
    localParticipant && // Memeriksa apakah ada partisipan lokal
    call?.state.createdBy && // Memeriksa apakah pembuat panggilan telah ditentukan
    localParticipant.userId === call.state.createdBy.id; // Memeriksa apakah partisipan lokal adalah pembuat panggilan

  if (!isMeetingOwner) return null; // Jika partisipan lokal bukan pembuat panggilan, kembalikan null

  return (
    <Button
      onClick={async () => {
        await call.endCall(); // Mengakhiri panggilan saat tombol diklik

        router.push("/"); // Navigasi ke halaman beranda setelah panggilan diakhiri
      }}
      className="bg-red-500">
      End Call for everyone
    </Button>
  );
};

export default EndCallButton; // Ekspor komponen EndCallButton
