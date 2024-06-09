"use client"
import { AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {pb} from "@/lib/utils";
import {medicalSpecialties} from "@/lib/values";
import {Combobox} from "@/components/ui/combo-box";
import {useState} from "react";
import {useRouter} from "next/navigation";

function getInitials(fullName: string) {
  if(!fullName) return '';
  const nameParts = fullName.split(" ");
  let initials = "";

  for (let i = 0; i < nameParts.length; i++) {
    initials += nameParts[i][0].toUpperCase();
  }

  return initials;
}

export function ProfilePage() {
  const [specialization, setSpecialization] = useState(pb?.authStore?.model?.collectionName === 'doctors' ? pb?.authStore?.model?.specialization[0] || "" : "");
  const [name, setName] = useState(pb?.authStore?.model?.name || "");

  const router = useRouter();

  const submit = async () => {
    const data = {
      "name": name,
      "specialization": [specialization]
    };
    await pb.collection(pb?.authStore?.model?.collectionName).update(pb?.authStore?.model?.id, data)
        .then(() => router.refresh());
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="gap-8">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="mb-4 h-24 w-24">
            <AvatarFallback>{getInitials(pb?.authStore?.model?.name)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-bold font-sans">{pb?.authStore?.model?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{
                pb?.authStore?.model?.collectionName === 'doctors' ? 'Doctor' :
                    pb?.authStore?.model?.collectionName === 'patients' ? 'Patient' : 'Staff'
            }</p>
          </div>
        </div>
        <div className="space-y-6 mt-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input className="mt-1 block w-full" value={name} onChange={(e) => setName(e.target.value)} type="text" />
          </div>
          { pb?.authStore?.model?.collectionName === 'doctors' &&
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Combobox value={specialization} onChange={setSpecialization} placeholder={"Select specialty..."} data={medicalSpecialties}/>
            </div>
          }
          <div className="flex justify-center">
            <Button onClick={submit} disabled={!name || (pb?.authStore?.model?.collectionName === 'doctors' && !specialization)} className="bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
