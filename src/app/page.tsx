import { ThemeModeToggle } from "@/components/theme/Toggle";
import axios from "axios";

async function getUserData() { 
  try {
    const response = await axios.get('http://localhost:3000/api/user');
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export default async function Home() {
  const userDetails = await getUserData();
  return (
    <div>
      <ThemeModeToggle />
      <p>Hello user</p>
      <p>{userDetails?.name}</p>
      <p>{userDetails?.email}</p>
    </div>
  );
}
