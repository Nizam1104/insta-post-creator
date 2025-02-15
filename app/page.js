"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/insta-post')
  }, [])
  return (
    <div>
      index page
    </div>
  );
}
