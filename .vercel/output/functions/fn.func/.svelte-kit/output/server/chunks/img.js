import { c as create_ssr_component, d as add_attribute } from "./ssr.js";
const Img = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { src } = $$props;
  let { alt } = $$props;
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  return `<img${add_attribute("src", src, 0)}${add_attribute("alt", alt, 0)} loading="lazy">`;
});
export {
  Img as I
};
