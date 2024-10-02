"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import { TopNavigation, AppLayout, SideNavigation } from "@cloudscape-design/components";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null);
  const [navigationOpen, setNavigationOpen] = useState(true);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(console.error);
  }, []);

  const handleClick = async (event: any): Promise<void> => {
    if (!event.detail) return;

    switch (event.detail.id) {
      case "signout":
        return await signOut();
    }
  };

  return (
    <html lang="en">
      <body>
        <Authenticator>
          <AppLayout
            navigation={
              <SideNavigation
                header={{
                  href: '/',
                  text: 'ThinkPaladar'
                }}
                items={[
                  { type: 'link', text: 'Ads', href: '/' },
                  { type: 'link', text: 'Reports', href: '/reports' }
                ]}
              />
            }
            navigationOpen={navigationOpen}
            onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
            content={
              <>
                <TopNavigation
                  identity={{ href: "#", title: "ThinkPaladar" }}
                  utilities={[
                    {
                      type: "button",
                      iconName: "star",
                      title: "Dark mode",
                    },
                    {
                      type: "menu-dropdown",
                      description: user?.signInDetails?.loginId || "Customer Email",
                      iconName: "user-profile",
                      onItemClick: handleClick,
                      items: [
                        { id: "signout", text: "Sign out" }
                      ]
                    }
                  ]}
                />
                {children}
              </>
            }
          />
        </Authenticator>
      </body>
    </html>
  );
}
