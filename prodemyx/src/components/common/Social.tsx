import InjectableSvg from "../../hooks/InjectableSvg";

const WHATSAPP_NUMBER = "918089438099";

const Social = () => {
  return (
    <>
      <li>
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InjectableSvg
            src="/assets/img/icons/facebook.svg"
            alt="Facebook"
            className="injectable"
          />
        </a>
      </li>

      <li>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InjectableSvg
            src="/assets/img/icons/twitter.svg"
            alt="Twitter"
            className="injectable"
          />
        </a>
      </li>

      <li>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InjectableSvg
            src="/assets/img/icons/whatsapp.svg"
            alt="WhatsApp"
            className="injectable"
          />
        </a>
      </li>

      <li>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InjectableSvg
            src="/assets/img/icons/instagram.svg"
            alt="Instagram"
            className="injectable"
          />
        </a>
      </li>

      <li>
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InjectableSvg
            src="/assets/img/icons/youtube.svg"
            alt="YouTube"
            className="injectable"
          />
        </a>
      </li>
    </>
  );
};

export default Social;
