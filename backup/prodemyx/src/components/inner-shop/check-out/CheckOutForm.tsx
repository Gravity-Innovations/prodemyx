interface Props {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
}

const CheckOutForm = ({
  firstName,
  lastName,
  email,
  phone,
  setFirstName,
  setLastName,
  setEmail,
  setPhone
}: Props) => {
  return (
    <div className="col-lg-7">
      <form onSubmit={(e) => e.preventDefault()} className="customer__form-wrap">

        <span className="title">Billing Details</span>

        {/* FIRST + LAST NAME */}
        <div className="row">
          <div className="col-md-6">
            <div className="form-grp">
              <label htmlFor="first-name">First name *</label>
              <input
                type="text"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-grp">
              <label htmlFor="last-name">Last name *</label>
              <input
                type="text"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        {/* EMAIL + PHONE */}
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="form-grp">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-grp">
              <label htmlFor="phone">Phone *</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CheckOutForm;
