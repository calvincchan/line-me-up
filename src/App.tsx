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
import { PublicScreen } from "./pages/bigscreen";
import { Dashboard } from "./pages/dashboard";
import { KioskDetails, KioskSubmitted, KioskWelcome } from "./pages/kiosk";
import { MemberList, MembertEdit } from "./pages/members";
import { VisitShow } from "./pages/visits";
import { supabaseClient } from "./utilities/supabase-client";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={RefineThemes.Orange}>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
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
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<Dashboard />} />

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
                    <ThemedLayoutV2>
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
        </RefineSnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
