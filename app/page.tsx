"use client";

import { useState } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import outputs from "@/amplify_outputs.json";
import AdvertisingComponent from "./backend/AdvertisingComponent";
import CompanySearchBar from "./backend/CompanySearchBar";
import AppLayout from "@cloudscape-design/components/app-layout";
import Header from "@cloudscape-design/components/header";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import HelpPanel from "@cloudscape-design/components/help-panel";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import { ContentLayout, TopNavigation } from "@cloudscape-design/components";
import { getCurrentUser, signOut } from "aws-amplify/auth";


Amplify.configure(outputs);

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);


  const handleClick = async (event: any, signOut: () => Promise<void>): Promise<void> => {
    if (!event.detail) return;

    switch (event.detail.id) {
      case "signout":
        return await signOut();
    }
  };


  return (
    <Authenticator>
        <>
          <TopNavigation
            identity={{ href: "#", title: "Service" }}
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
                onItemClick: (event) => {
                  if (signOut) {
                    handleClick(event, signOut);
                  } else {
                    console.error("signOut is undefined");
                  }
                },
                items: [
                  { id: "signout", text: "Sign out" }
                ]
              }
            ]}
          />
          <AppLayout
            content={
              <ContentLayout> 
                <SpaceBetween size="l">
                  {selectedCompany && (
                    <AdvertisingComponent selectedCompany={selectedCompany} isLoading={isLoading} />
                  )}
                </SpaceBetween>
              </ContentLayout>
            }
            navigationOpen={false}
            notifications={
              <CompanySearchBar
                selectedCompany={selectedCompany}
                isLoading={isLoading}
                onSelect={setSelectedCompany}
              />
            }
          />
        </>
      {/* )} */}
    </Authenticator>
  );
}
