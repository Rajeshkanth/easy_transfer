import React, { memo } from "react";
import axios from "axios";
import { toast } from "sonner";

function ProfileForm(props) {
  const {
    setIsEditProfile,
    userName,
    setUserNameFromDb,
    setAgeFromDb,
    setAccFromDb,
    setDobFromDb,
    setCardFromDb,
    setCvvFromDb,
    setExpireDateFromDb,
    cardFromDb,
    cvvFromDb,
    expireDateFromDb,
    setUserName,
    age,
    setAge,
    dob,
    setDob,
    accNumber,
    setAccNumber,
    card,
    setCard,
    cvv,
    setCvv,
    expireDate,
    setExpireDate,
    connectionMode,
    socket,
    accFromDb,
    dobFromDb,
    mobileNumber,
    setMobileNumber,
  } = props.states;

  const allFieldsFilled =
    userName &&
    age &&
    (dob || dobFromDb) &&
    (accNumber || accFromDb) &&
    (card || cardFromDb) &&
    (cvv || cvvFromDb) &&
    (expireDate || expireDateFromDb !== undefined);

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleAge = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setAge(sanitizedValue);
    }
  };

  const handleMobileNumber = (e) => {
    sessionStorage.setItem("mobileNumber", e.target.value);
    setMobileNumber(e.target.value);
  };

  const handleDob = (e) => {
    const value = e.target.value;
    setDob(value);
  };

  const handleAccNumber = (e) => {
    const value = e.target.value;
    if (value.length <= 16) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setAccNumber(sanitizedValue);
    }
  };

  const handleCardNumber = (e) => {
    const value = e.target.value;
    if (value.length <= 16) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setCard(sanitizedValue);
    }
  };

  const handleExpireDate = (e) => {
    let enteredValue = e.target.value;
    enteredValue = enteredValue.replace(/\D/g, "");
    let month = enteredValue.slice(0, 2);
    let year = enteredValue.slice(2);
    if (month.length === 2) {
      month = parseInt(month, 10);
      !isNaN(month) && month >= 1 && month <= 12
        ? (month = month.toString().padStart(2, "0"))
        : (month = "");
    } else if (month.length === 1 && parseInt(month, 10) > 1) {
      month = "0" + month;
    }

    let formattedValue = month + (year ? "/" + year : "");
    if (enteredValue.length <= 4) setExpireDate(formattedValue);
  };

  const handleCvv = (e) => {
    const value = e.target.value;
    if (value.length <= 3) {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setCvv(sanitizedValue);
    }
  };

  const clearProfileEditForm = () => {
    setUserNameFromDb("");
    setAccFromDb("");
    setAgeFromDb("");
    setDobFromDb("");
    setCardFromDb("");
    setCvvFromDb("");
    setExpireDateFromDb("");
  };

  const clearProfileField = () => {
    setUserName("");
    setAge("");
    setDob("");
    setAccNumber("");
    setCard("");
    setCvv("");
    setExpireDate("");
  };

  const cancelEdit = () => {
    setIsEditProfile(false);
    clearProfileField();
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const allFieldsFilled =
      userName &&
      age &&
      (dob || dobFromDb) &&
      (accNumber || accFromDb) &&
      (card || cardFromDb) &&
      (cvv || cvvFromDb) &&
      (expireDate || expireDateFromDb !== undefined);
    if (!allFieldsFilled) {
      alert("Enter all details");
      return;
    }

    // const updatedMobileNumber = sessionStorage.getItem("mobileNumber")
    //   ? sessionStorage.getItem("mobileNumber")
    //   : mobileNumber;
    const mobileNumber = sessionStorage.getItem("mobileNumber");
    try {
      if (connectionMode !== "socket") {
        await axios
          .post(
            "http://localhost:8080/api/user/updateProfile",
            {
              mobileNumber: mobileNumber,
              userName: userName,
              age: age,
              dob: dob || dobFromDb,
              accNum: accNumber || accFromDb,
              card: card || cardFromDb,
              cvv: cvv || cvvFromDb,
              expireDate: expireDate || expireDateFromDb,
            },
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            const { userName, age, dob, accNum, card, cvv, expireDate } =
              res.data;
            if (res.status === 200) {
              setUserNameFromDb(userName);
              setAccFromDb(accNum);
              setAgeFromDb(age);
              setDobFromDb(dob);
              setCardFromDb(card);
              setCvvFromDb(cvv);
              setExpireDateFromDb(expireDate);
              cancelEdit();
              toast.success("Profile updated.", {
                className: "text-green-500",
              });
            }
          })
          .catch((err) => {
            toast.error("Internal server error", { err });
          });
      } else {
        socket.emit("updateProfile", {
          mobileNumber: mobileNumber,
          name: userName,
          age: age,
          dob: dob,
          accNum: accNumber,
          card: card,
          cvv: cvv,
          expireDate: expireDate,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // useEffect(() => {
  //   socket.on("profileUpdated", (data) => {
  //     const { userName, accNum, dob, card, cvv, age, expireDate } = data;
  //     setUserNameFromDb(userName);
  //     setAccFromDb(accNum);
  //     setAgeFromDb(age);
  //     setDobFromDb(dob);
  //     setCardFromDb(card);
  //     setCvvFromDb(cvv);
  //     setExpireDateFromDb(expireDate);
  //     cancelEdit();
  //   });

  //   return () => {
  //     clearProfileEditForm();
  //   };
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     clearProfileEditForm();
  //   };
  // }, []);
  return (
    <form
      onSubmit={(e) => updateProfile(e)}
      autoComplete="off"
      className="max-w-md mx-auto bg-white shadow-sm shadow-gray-700 rounded-md p-8 px-10 sm:px-12 box-border"
    >
      <span className="text-center text-gray-900 w-full flex justify-center mb-3 font-semibold text-lg">
        Update Profile
      </span>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="floating_name"
            id="floating_name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={userName ? userName : ""}
            onChange={handleUserName}
            onInvalid={(F) => F.target.setCustomValidity("Enter name")}
            onInput={(F) => F.target.setCustomValidity("")}
          />
          <label
            for="floating_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="tel"
            name="floating_age"
            id="floating_age"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={age}
            maxLength={3}
            onChange={handleAge}
            onInvalid={(F) => F.target.setCustomValidity("Enter age")}
            onInput={(F) => F.target.setCustomValidity("")}
          />
          <label
            for="floating_age"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            age
          </label>
        </div>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="tel"
            // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            name="floating_phone"
            id="floating_phone"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            // readOnly={sessionStorage.getItem("mobileNumber") ? true : false}
            value={sessionStorage.getItem("mobileNumber")}
            // onChange={handleMobileNumber}
            onInvalid={(F) => F.target.setCustomValidity("Enter mobile number")}
            onInput={(F) => F.target.setCustomValidity("")}
          />
          <label
            for="floating_phone"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Phone number
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="date"
            name="floating_dob"
            id="floating_dob"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            disabled={dobFromDb ? true : false}
            value={dobFromDb ? dobFromDb : dob}
            onChange={handleDob}
            onInvalid={(F) => F.target.setCustomValidity("Enter date of birth")}
            onInput={(F) => F.target.setCustomValidity("")}
          />
          <label
            for="floating_dob"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Date of birth
          </label>
        </div>
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <input
          name="floating_account_number"
          id="floating_account_number"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
          maxLength={16}
          type="tel"
          disabled={accFromDb ? true : false}
          value={accFromDb ? accFromDb : accNumber}
          onChange={handleAccNumber}
          placeholder=" "
          onInvalid={(F) => F.target.setCustomValidity("Enter account number")}
          onInput={(F) => F.target.setCustomValidity("")}
        />
        <label
          for="floating_account_number"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Account number
        </label>
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="tel"
          name="floating_card"
          id="floating_card"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          maxLength={16}
          value={cardFromDb ? cardFromDb : card}
          disabled={cardFromDb ? true : false}
          onChange={handleCardNumber}
          onInvalid={(F) => F.target.setCustomValidity("Enter card number")}
          onInput={(F) => F.target.setCustomValidity("")}
        />
        <label
          for="floating_card"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Debit card
        </label>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-8 group">
          <input
            type="tel"
            name="cvv"
            id="cvv"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            maxLength={3}
            value={cvvFromDb ? cvvFromDb : cvv}
            disabled={cvvFromDb ? true : false}
            onChange={handleCvv}
            onInvalid={(F) => F.target.setCustomValidity("Enter cvv")}
            onInput={(F) => F.target.setCustomValidity("")}
          />
          <label
            for="cvv"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            CVV
          </label>
        </div>
        <div className="relative z-0 w-full mb-8 group">
          <input
            type="tel"
            name="expire_date"
            id="expire_date"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            maxLength={5}
            value={expireDateFromDb ? expireDateFromDb : expireDate}
            disabled={expireDateFromDb ? true : false}
            onChange={handleExpireDate}
            onInvalid={(F) => F.target.setCustomValidity("Enter expire date")}
            onInput={(F) => F.target.setCustomValidity("")}
          />
          <label
            for="expire_date"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Expire date
          </label>
        </div>
      </div>
      <div className="relative z-0 w-full flex justify-between gap-2 sm:gap-5 group">
        <button
          disabled={!allFieldsFilled}
          type="submit"
          className={`text-white ${
            allFieldsFilled
              ? `bg-gray-800 hover:bg-gray-900 focus:ring-4`
              : `bg-gray-400`
          } focus:outline-none focus:ring-gray-700 font-medium rounded-lg text-sm w-1/2 px-5 py-2.5 text-center `}
        >
          Submit
        </button>
        <button
          className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-700 font-medium rounded-lg text-sm w-1/2 px-5 py-2.5 text-center"
          onClick={cancelEdit}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default memo(ProfileForm);
