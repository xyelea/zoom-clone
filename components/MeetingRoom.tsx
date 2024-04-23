"use client"; // Menambahkan komentar untuk memberi tahu bahwa ini adalah penggunaan klien

import { cn } from "@/lib/utils"; // Import fungsi cn dari utilitas lokal

import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk"; // Import komponen dan hook yang diperlukan dari video-react-sdk
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import komponen dropdown-menu dari komponen lokal

import React, { useState } from "react"; // Import React dan useState dari modul React
import { LayoutList, User } from "lucide-react"; // Import komponen LayoutList dan User dari lucide-react

import { useSearchParams } from "next/navigation"; // Import hook useSearchParams dari next/navigation
import EndCallButton from "./EndCallButton"; // Import komponen EndCallButton dari file lokal
import Loader from "./Loader"; // Import komponen Loader dari file lokal

type CallLayoutType = "grid" | "speaker-left" | "speaker-right"; // Deklarasikan tipe CallLayoutType

const MeetingRoom = () => {
  const searchParams = useSearchParams(); // Gunakan hook useSearchParams untuk mendapatkan parameter pencarian
  const isPersonalRoom = !!searchParams.get("personal"); // Periksa apakah ini adalah ruangan pribadi berdasarkan parameter pencarian
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left"); // State untuk tata letak panggilan
  const [showParticipants, setShowParticipant] = useState(false); // State untuk menampilkan daftar partisipan

  const { useCallCallingState } = useCallStateHooks(); // Gunakan useCallStateHooks untuk mendapatkan status panggilan
  const callingState = useCallCallingState(); // State untuk status panggilan

  if (callingState !== CallingState.JOINED) return <Loader />; // Jika belum bergabung dengan panggilan, tampilkan Loader

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />; // Tampilkan tata letak grid jika dipilih

      case "speaker-right":
        return <SpeakerLayout participantsBarPosition={"left"} />; // Tampilkan tata letak speaker dengan bilah partisipan di sebelah kiri jika dipilih
      default:
        return <SpeakerLayout participantsBarPosition={"right"} />; // Tampilkan tata letak speaker dengan bilah partisipan di sebelah kanan jika tidak dipilih
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
          {/* Render komponen CallLayout */}
        </div>
        <div
          className={cn(`h-[calc(100vh-86px)] hidden ml-2`, {
            "show-block": showParticipants,
          })}>
          <CallParticipantsList onClose={() => setShowParticipant(false)} />
          {/* Render daftar partisipan panggilan */}
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls />
        {/* Render kontrol panggilan */}
        <DropdownMenu>
          {" "}
          {/* Render dropdown menu */}
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg=[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["grid", "speaker-left", "speaker-right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setLayout(item.toLowerCase() as CallLayoutType); // Atur tata letak panggilan berdasarkan item yang dipilih
                  }}>
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton /> {/* Render tombol statistik panggilan */}
        <button onClick={() => setShowParticipant((prev) => !prev)}>
          {" "}
          {/* Tombol untuk menampilkan/menyembunyikan daftar partisipan */}
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <User size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}{" "}
        {/* Render tombol akhir panggilan jika bukan ruangan pribadi */}
      </div>
    </section>
  );
};

export default MeetingRoom; // Ekspor komponen MeetingRoom
