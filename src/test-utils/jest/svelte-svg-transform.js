import { compile } from 'svelte/compiler';

const process = () => {
    const emptySvg = `<svg xmlns="http://www.w3.org/2000/svg" class="{$$props.class}"></svg>`;

    // Emit CommonJS that Jest can understand.
    const compiled = compile(emptySvg, { format: 'cjs' });

    // Fixes the '_Sample.default is not a constructor' error when importing in Jest.
    const esInterop = 'Object.defineProperty(exports, "__esModule", { value: true });';

    const code = `${compiled.js.code}${esInterop}`;
    return { code };
};

export default {
    process,
    getCacheKey() {
        return 'svelteSvgTransformCJS';
    },
};
