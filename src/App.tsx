import { Dashboard, Notifications } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import { Authenticated, Refine } from "@refinedev/core";
import {
  AuthPage,
  ErrorComponent,
  RefineSnackbarProvider,
  RefineThemes,
  ThemedLayoutV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/mui";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import { accessControlProvider } from "./access-control-provider";
import authProvider from "./auth-provider";
import { WaitTimeProvider } from "./components/wait-time-context";
import { PublicScreen } from "./pages/bigscreen";
import { DashboardList } from "./pages/dashboard";
import { KioskDetails, KioskSubmitted, KioskWelcome } from "./pages/kiosk";
import { MemberList, MembertEdit } from "./pages/members";
import { VisitShow } from "./pages/visits";
import { supabaseClient } from "./utilities/supabase-client";

interface AppTitleProps {
  collapsed?: boolean;
}

const AppTitle: React.FC<AppTitleProps> = ({ collapsed = false }) => {
  return (
    <ThemedTitleV2
      collapsed={collapsed}
      text="Line Up Here"
      icon={<Notifications />}
    />
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={RefineThemes.Orange}>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <WaitTimeProvider>
            <Refine
              authProvider={authProvider}
              dataProvider={dataProvider(supabaseClient)}
              liveProvider={liveProvider(supabaseClient)}
              routerProvider={routerProvider}
              notificationProvider={useNotificationProvider}
              accessControlProvider={accessControlProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Dashboard",
                    icon: <Dashboard />,
                  },
                },
                {
                  name: "member",
                  list: "/members",
                  edit: "/members/edit/:id",
                },
                {
                  name: "station",
                  list: "/stations",
                  edit: "/stations/edit/:id",
                },
                {
                  name: "visit",
                  show: "/visits/:id",
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2
                        Title={({ collapsed }) => (
                          <AppTitle collapsed={collapsed} />
                        )}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<DashboardList />} />

                  <Route path="/members">
                    <Route index element={<MemberList />} />
                    <Route path="edit/:id" element={<MembertEdit />} />
                  </Route>
                </Route>

                <Route
                  element={
                    <Authenticated key="auth-pages" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        rememberMe={false}
                        registerLink={false}
                        forgotPasswordLink={false}
                        title={<AppTitle />}
                        renderContent={(content, title) => (
                          <>
                            <Stack spacing={2} textAlign="center">
                              <Box>
                                {title}
                                {content}
                              </Box>
                              <Link to="/bigscreen" target="bigscreen">
                                <Button>View Public Screen</Button>
                              </Link>
                              <Link to="/kiosk" target="kiosk">
                                <Button>View Kiosk</Button>
                              </Link>
                            </Stack>
                          </>
                        )}
                      />
                    }
                  />
                </Route>
                <Route>
                  <Route path="/bigscreen" element={<PublicScreen />} />
                  <Route path="/kiosk">
                    <Route index element={<KioskWelcome />} />
                    <Route path="details" element={<KioskDetails />} />
                    <Route path="submitted" element={<KioskSubmitted />} />
                  </Route>
                  <Route path="/visits/:id" element={<VisitShow />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="catch-all">
                      <ThemedLayoutV2
                        Title={({ collapsed }) => (
                          <AppTitle collapsed={collapsed} />
                        )}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </WaitTimeProvider>
        </RefineSnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
