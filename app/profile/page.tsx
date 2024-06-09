"use client"
import {Button} from "@/components/ui/button";
import {pb} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {ProfilePage} from "@/components/component/profile-page";
import Link from "next/link";

export default function Page(){
    const router = useRouter();
    const logout = () => {
        pb.authStore.clear();
        router.push('/login');
    }
    return (
        <div>
            <div className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                <div className="flex-1">
                    <h1 className="text-lg">Profile</h1>
                </div>
                <Link href={"/dashboard"}><Button variant="outline">Dashboard</Button></Link>
                <Button onClick={logout} variant="outline">Log Out</Button>
            </div>
            <ProfilePage />
        </div>
    )
}