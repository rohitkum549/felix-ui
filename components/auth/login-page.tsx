// import { useAuth } from "@/contexts/auth-context";

// export default function LoginPage() {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     // Optionally, show a loading spinner or nothing, since Keycloak will redirect to login
//     return <div>Redirecting to login...</div>;
//   }

//   // Render your main app content here
//   return (
//     <div>
//       {/* Your app's main content */}
//     </div>
//   );
// }
// // 