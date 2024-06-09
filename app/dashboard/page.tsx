"use client"
import {PatientDashboard} from "@/components/component/patient-dashboard";
import {pb} from "@/lib/utils";
import {useRouter} from "next/navigation";
import DoctorDashboard from "@/components/component/doctor-dashboard";
import StaffDashboard from "@/components/component/staff-dashboard";


export default function Page(){
    const router = useRouter();
    if(!pb.authStore.isValid){
        router.push('/login');
    }
    if(pb?.authStore?.model?.collectionName === "patients"){
        return <PatientDashboard />
    }
    if(pb?.authStore?.model?.collectionName === "doctors"){
        return <DoctorDashboard />
    }
    if(pb?.authStore?.model?.collectionName === "staff"){
        return <StaffDashboard />
    }
}