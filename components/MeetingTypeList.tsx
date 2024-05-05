"use client"; // Menambahkan komentar untuk memberi tahu bahwa ini adalah penggunaan klien

import HomeCard from "./HomeCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

const MeetingTypeList = () => {
  const router = useRouter(); // Menggunakan useRouter untuk mendapatkan objek router

  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined); // State untuk mengatur status pertemuan

  const { user } = useUser(); // Menggunakan useUser untuk mendapatkan informasi pengguna yang diotentikasi
  const { toast } = useToast(); // Menggunakan useToast untuk menampilkan pesan toast
  const client = useStreamVideoClient(); // Menggunakan useStreamVideoClient untuk mendapatkan klien video streaming
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  }); // State untuk nilai awal form
  const [callDetails, setCallDetails] = useState<Call>(); // State untuk detail panggilan

  const createMeeting = async () => {
    if (!client || !user) return; // Periksa apakah klien atau pengguna tidak tersedia

    try {
      if (!values.dateTime) {
        toast({ title: "Please select date and time" }); // Tampilkan pesan toast jika tanggal dan waktu belum dipilih
        return;
      }

      const id = crypto.randomUUID(); // Buat ID acak untuk panggilan
      const call = client.call("default", id); // Membuat panggilan baru dengan ID acak

      if (!call) throw new Error("Failed to create call"); // Lempar error jika panggilan gagal dibuat

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString(); // Format tanggal dan waktu untuk mulai panggilan
      const description = values.description || "Instant meeting"; // Deskripsi panggilan

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      }); // Mendapatkan atau membuat panggilan dengan data yang diberikan
      setCallDetails(call); // Set detail panggilan
      if (!values.description) {
        router.push(`/meeting/${call.id}`); // Navigasi ke halaman pertemuan jika deskripsi tidak ada
      }

      toast({ title: "Meeting created" }); // Tampilkan pesan toast bahwa pertemuan telah dibuat
    } catch (error) {
      toast({ title: `terjadi error : ${error}` }); // Tampilkan pesan toast jika terjadi error
      console.log(error); // Tampilkan error di konsol
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`; // Link pertemuan

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
      {/* Render komponen HomeCard */}
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />

      {/* reusable modal */}
      {!callDetails ? (
        // Render komponen MeetingModal untuk membuat pertemuan baru
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}>
          <div className="flex flex-col gap-2.5">
            {/* Label dan Textarea untuk menambahkan deskripsi */}
            <label
              htmlFor=""
              className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            {/* Label dan ReactDatePicker untuk memilih tanggal dan waktu */}
            <label
              htmlFor=""
              className="text-base text-normal leading-[22px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat={"MMMM d, yyyy h:mm aa"}
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        // Render komponen MeetingModal ketika pertemuan berhasil dibuat
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link copied" });
          }}
          buttonText="Copy Meeting Link"
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}
      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
