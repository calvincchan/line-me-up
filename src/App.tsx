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
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import authProvider from "./auth-provider";
import { PublicScreen } from "./pages/bigscreen";
import { KioskDetails, KioskSubmitted, KioskWelcome } from "./pages/kiosk";
import { MemberList, MembertEdit } from "./pages/members";
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
            resources={[
              {
                name: "member",
                list: "/members",
                edit: "/members/edit/:id",
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
                <Route
                  index
                  element={<NavigateToResource resource="member" />}
                />

                <Route path="/members">
                  <Route index element={<MemberList />} />
                  <Route path="edit/:id" element={<MembertEdit />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="posts" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      rememberMe={<></>}
                      registerLink={<></>}
                      forgotPasswordLink={<></>}
                    />
                  }
                />
                <Route path="/bigscreen" element={<PublicScreen />} />
                <Route path="/kiosk">
                  <Route index element={<KioskWelcome />} />
                  <Route path="details" element={<KioskDetails />} />
                  <Route path="submitted" element={<KioskSubmitted />} />
                </Route>
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
