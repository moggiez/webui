import React, { useEffect, useState } from "react";
import FormAlert from "components/FormAlert";
import AuthForm from "components/AuthForm";
import AuthSocial from "components/AuthSocial";
import AuthFooter from "components/AuthFooter";
import { useRouter } from "next/router";

function Auth(props) {
  const router = useRouter();
  const [formAlert, setFormAlert] = useState(null);

  const handleSignup = (data) => {
    let path = props.afterSignupPath;
    if (data && data.Session === null) {
      path += "#afterSignup";
    }
    router.push(path);
  };

  const handleAuth = () => {
    router.push(props.afterAuthPath);
  };

  const handleConfirmation = (data) => {
    router.push(`${props.afterConfirmationPath}#confirmed`);
  };

  const handleFormAlert = (data) => {
    setFormAlert(data);
  };

  useEffect(() => {
    if (router && router.asPath) {
      const parts = router.asPath.split("#");
      if (parts.length > 1) {
        if (parts[1] === "afterSignup") {
          setFormAlert({
            type: "success",
            message:
              "We've sent you an email containing a link to confirm your account. Please check your email.",
          });
        } else if (parts[1] === "confirmed") {
          setFormAlert({
            type: "success",
            message:
              "Your account has been confirmed. Please login with your credentials.",
          });
        }
      }
    }
  }, [router.query.id]);

  return (
    <>
      {formAlert && (
        <FormAlert type={formAlert.type} message={formAlert.message} />
      )}

      <AuthForm
        type={props.type}
        typeValues={props.typeValues}
        onAuth={handleAuth}
        onSignup={handleSignup}
        onFormAlert={handleFormAlert}
        onConfirmation={handleConfirmation}
      />

      {["signup", "signin"].includes(props.type) && (
        <>
          {props.providers && props.providers.length && (
            <>
              <small className="text-center d-block my-3">OR</small>
              <AuthSocial
                type={props.type}
                buttonText={props.typeValues.buttonText}
                providers={props.providers}
                showLastUsed={true}
                onAuth={handleAuth}
                onError={(message) => {
                  handleFormAlert({
                    type: "error",
                    message: message,
                  });
                }}
              />
            </>
          )}

          <AuthFooter type={props.type} typeValues={props.typeValues} />
        </>
      )}
    </>
  );
}

export default Auth;
