"use client"
import {PatientDashboard} from "@/components/component/patient-dashboard";
import {pb} from "@/lib/utils";
import {useRouter} from "next/navigation";
import DoctorDashboard from "@/components/component/doctor-dashboard";
import StaffDashboard from "@/components/component/staff-dashboard";
import {useEffect, useState} from "react";



export default function Page(){
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null;

    }
    if(!pb.authStore.isValid){
        router.push('/login');
    }
    if(pb?.authStore?.model?.collectionName === "patients"){
        if(pb.authStore?.model?.name === "init_value"){
            router.push('/onboard/patients');
        }
        return <PatientDashboard />
    }
    if(pb?.authStore?.model?.collectionName === "doctors"){
        if(pb.authStore?.model?.name === "init_value"){
            router.push('/onboard/doctors');
        }
        return <DoctorDashboard />
    }
    if(pb?.authStore?.model?.collectionName === "staff"){
        if(pb.authStore?.model?.name === "init_value"){
            router.push('/onboard/staff');
        }
        return <StaffDashboard />
    }
}
