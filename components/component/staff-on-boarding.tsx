"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import {useState, useEffect} from "react";
import {pb} from "@/lib/utils";
import {useRouter} from "next/navigation";

export function StaffOnBoarding() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const router = useRouter();

    useEffect(() => {
        if(!pb.authStore.isValid || pb?.authStore?.model?.collectionName !== "staff"){
            router.push('/login');
        }
    }, []);


    const submit = async () => {
        const data = {
            "name": lastName + " " + firstName,
        };
        await pb.collection('staff').update(pb?.authStore?.model?.id, data);
        router.push('/dashboard');
    }

    return (
        <div className={"w-full h-screen flex flex-col justify-center items-center space-y-8"}>
            <div className={"flex flex-col items-center"}>
                <Image className={"rounded-full overflow-hidden"} src={"/logo.svg"} alt={"logo"} width={50} height={50}/>
                <h1 className={"text-xl font-semibold"}>MediManage</h1>
            </div>
            <div className="mx-auto max-w-md space-y-6 px-4 pb-12 sm:px-6 lg:px-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Staff Onboarding</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Please fill out the following information to complete your onboarding.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Mosbahi" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="Walid" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                    </div>
                    <Button onClick={submit} className="w-full" disabled={!firstName || !lastName }>
                        Complete Onboarding
                    </Button>
                </div>
            </div>
        </div>
    )
}
