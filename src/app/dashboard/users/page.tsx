import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function UserManagementPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage all users of the Felix Platform. This section is under construction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>A table of users with roles, statuses, and actions will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
