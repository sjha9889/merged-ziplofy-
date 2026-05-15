"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSectionTheme = isSectionTheme;
exports.loadThemePackFromDisk = loadThemePackFromDisk;
exports.loadThemePack = loadThemePack;
exports.loadThemePackSync = loadThemePackSync;
exports.flattenEditorSchema = flattenEditorSchema;
exports.deepMergeConfig = deepMergeConfig;
exports.computeStoreOverrides = computeStoreOverrides;
exports.normalizeStoreOverrides = normalizeStoreOverrides;
exports.mergeThemePackConfig = mergeThemePackConfig;
exports.formValuesFromPackConfig = formValuesFromPackConfig;
exports.mergedConfigFromFormValues = mergedConfigFromFormValues;
exports.resolveStoreThemeConfig = resolveStoreThemeConfig;
exports.hasSectionEditorPack = hasSectionEditorPack;
exports.resolveStoreThemeConfigSync = resolveStoreThemeConfigSync;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const theme_config_util_1 = require("./theme-config.util");
const SECTION_THEME_SLUGS = new Set(['makeup', 'lumiere-beauty', 'lumiere']);
const packCache = new Map();
function normalizeThemeSlug(themePath) {
    return themePath
        .trim()
        .toLowerCase()
        .replace(/^\/+|\/+$/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function isSectionTheme(themePath) {
    if (!themePath)
        return false;
    const slug = normalizeThemeSlug(themePath);
    return SECTION_THEME_SLUGS.has(slug) || slug.includes('makeup') || slug.includes('lumiere');
}
const DEFAULT_CONFIG_NAMES = ['theme.default-config.json', 'theme.config.default.json'];
const SCHEMA_NAMES = ['theme.schema.json', 'theme.editor-schema.json'];
const MANIFEST_NAMES = ['theme.manifest.json'];
function resolvePackDir(themePath) {
    const slug = normalizeThemeSlug(themePath);
    const candidates = [
        path_1.default.join(process.cwd(), '..', 'remote-themes', slug),
        path_1.default.join(process.cwd(), 'remote-themes', slug),
        path_1.default.join(process.cwd(), '..', 'remote-themes', slug, 'config'),
        path_1.default.join(process.cwd(), 'remote-themes', slug, 'config'),
        path_1.default.join(__dirname, '..', 'theme-packs', slug),
        path_1.default.join(process.cwd(), 'src', 'theme-packs', slug),
        path_1.default.join(process.cwd(), 'build', 'theme-packs', slug),
    ];
    for (const dir of candidates) {
        for (const name of DEFAULT_CONFIG_NAMES) {
            if (fs_1.default.existsSync(path_1.default.join(dir, name)))
                return dir;
        }
    }
    return null;
}
function firstExistingFile(dir, names) {
    for (const name of names) {
        const p = path_1.default.join(dir, name);
        if (fs_1.default.existsSync(p))
            return p;
    }
    return null;
}
function readJsonFile(filePath) {
    try {
        const raw = fs_1.default.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    }
    catch {
        return null;
    }
}
async function fetchJsonUrl(url) {
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!res.ok)
            return null;
        const parsed = (await res.json());
        return parsed && typeof parsed === 'object' ? parsed : null;
    }
    catch {
        return null;
    }
}
function loadThemePackFromDisk(themePath) {
    const slug = normalizeThemeSlug(themePath);
    const cached = packCache.get(`disk:${slug}`);
    if (cached)
        return cached;
    const dir = resolvePackDir(themePath);
    if (!dir)
        return null;
    const defaultPath = firstExistingFile(dir, DEFAULT_CONFIG_NAMES);
    const schemaPath = firstExistingFile(dir, SCHEMA_NAMES);
    if (!defaultPath || !schemaPath)
        return null;
    const defaultConfig = readJsonFile(defaultPath);
    const editorSchema = readJsonFile(schemaPath);
    if (!defaultConfig || !editorSchema)
        return null;
    const manifestPath = firstExistingFile(dir, MANIFEST_NAMES);
    const manifest = manifestPath ? readJsonFile(manifestPath) : undefined;
    const pack = { defaultConfig, editorSchema, manifest: manifest ?? undefined };
    packCache.set(`disk:${slug}`, pack);
    return pack;
}
async function loadThemePack(themePath, s3Refs) {
    const slug = normalizeThemeSlug(themePath);
    const cacheKey = `full:${slug}`;
    if (packCache.has(cacheKey))
        return packCache.get(cacheKey);
    const disk = loadThemePackFromDisk(themePath);
    if (disk && !s3Refs?.reactThemeSchema?.url) {
        packCache.set(cacheKey, disk);
        return disk;
    }
    const schemaUrl = s3Refs?.reactThemeSchema?.url;
    const defaultUrl = s3Refs?.reactThemeDefaultConfig?.url;
    const manifestUrl = s3Refs?.reactThemeManifest?.url;
    if (schemaUrl && defaultUrl) {
        const [editorSchema, defaultConfig, manifestFromS3] = await Promise.all([
            fetchJsonUrl(schemaUrl),
            fetchJsonUrl(defaultUrl),
            manifestUrl ? fetchJsonUrl(manifestUrl) : Promise.resolve(null),
        ]);
        if (editorSchema && defaultConfig) {
            const pack = {
                defaultConfig,
                editorSchema,
                manifest: manifestFromS3 ?? disk?.manifest,
            };
            packCache.set(cacheKey, pack);
            return pack;
        }
    }
    if (disk) {
        packCache.set(cacheKey, disk);
        return disk;
    }
    return null;
}
/** @deprecated Use loadThemePack async */
function loadThemePackSync(themePath) {
    return loadThemePackFromDisk(themePath);
}
function editorFieldType(type) {
    if (type === 'textarea')
        return 'textarea';
    if (type === 'boolean')
        return 'boolean';
    if (type === 'color')
        return 'color';
    return 'text';
}
function flattenEditorSchema(schema) {
    const fields = [];
    const seen = new Set();
    const push = (f) => {
        if (!f.path || seen.has(f.path))
            return;
        seen.add(f.path);
        fields.push({
            key: f.path,
            label: f.label || f.path,
            type: editorFieldType(f.type),
            default: f.type === 'boolean' ? false : '',
        });
    };
    for (const group of schema.globalSettings?.groups ?? []) {
        for (const f of group.fields ?? [])
            push(f);
    }
    for (const layout of Object.values(schema.layout ?? {})) {
        for (const f of layout.settingsFields ?? [])
            push(f);
        for (const block of layout.blocks ?? []) {
            for (const f of block.settingsFields ?? [])
                push(f);
        }
    }
    for (const tpl of schema.templates ?? []) {
        for (const section of tpl.sections ?? []) {
            for (const f of section.settingsFields ?? [])
                push(f);
        }
    }
    return fields;
}
function deepMergeConfig(target, source) {
    const out = { ...target };
    for (const [k, v] of Object.entries(source)) {
        if (v != null &&
            typeof v === 'object' &&
            !Array.isArray(v) &&
            out[k] != null &&
            typeof out[k] === 'object' &&
            !Array.isArray(out[k])) {
            out[k] = deepMergeConfig(out[k], v);
        }
        else if (v !== undefined) {
            out[k] = v;
        }
    }
    return out;
}
function jsonEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
/** Store only merchant deltas from theme defaults. */
function computeStoreOverrides(merged, defaults) {
    const out = {};
    for (const [k, v] of Object.entries(merged)) {
        const dv = defaults[k];
        if (v != null &&
            typeof v === 'object' &&
            !Array.isArray(v) &&
            dv != null &&
            typeof dv === 'object' &&
            !Array.isArray(dv)) {
            const nested = computeStoreOverrides(v, dv);
            if (Object.keys(nested).length > 0)
                out[k] = nested;
        }
        else if (!jsonEqual(v, dv)) {
            out[k] = v;
        }
    }
    return out;
}
/** If legacy rows stored the full merged config, strip back to overrides only. */
function normalizeStoreOverrides(saved, pack) {
    if (!saved || typeof saved !== 'object')
        return {};
    if ('version' in saved && ('sections' in saved || 'templates' in saved)) {
        return computeStoreOverrides(saved, pack.defaultConfig);
    }
    return saved;
}
function mergeThemePackConfig(storeOverrides, pack) {
    const overrides = normalizeStoreOverrides(storeOverrides, pack);
    if (!Object.keys(overrides).length)
        return pack.defaultConfig;
    return deepMergeConfig(pack.defaultConfig, overrides);
}
function formValuesFromPackConfig(config, schema) {
    const values = {};
    for (const field of schema) {
        const v = (0, theme_config_util_1.getNestedValue)(config, field.key);
        if (field.type === 'boolean') {
            values[field.key] = Boolean(v);
        }
        else {
            values[field.key] = v == null ? String(field.default) : String(v);
        }
    }
    return values;
}
function mergedConfigFromFormValues(values, schema, defaultConfig) {
    const config = JSON.parse(JSON.stringify(defaultConfig));
    for (const field of schema) {
        const raw = values[field.key];
        if (raw === undefined)
            continue;
        (0, theme_config_util_1.setNestedValue)(config, field.key, field.type === 'boolean' ? Boolean(raw) : String(raw));
    }
    return config;
}
async function resolveStoreThemeConfig(saved, themePath, s3Refs) {
    if (themePath) {
        const pack = await loadThemePack(themePath, s3Refs);
        if (pack)
            return mergeThemePackConfig(saved ?? undefined, pack);
    }
    return (0, theme_config_util_1.mergeThemeConfig)(saved);
}
/** True when catalog S3 or disk has schema + default config for the section editor. */
function hasSectionEditorPack(pack, s3Refs) {
    if (pack)
        return true;
    return Boolean(s3Refs?.reactThemeSchema?.url && s3Refs?.reactThemeDefaultConfig?.url);
}
function resolveStoreThemeConfigSync(saved, themePath) {
    if (themePath && isSectionTheme(themePath)) {
        const pack = loadThemePackFromDisk(themePath);
        if (pack)
            return mergeThemePackConfig(saved ?? undefined, pack);
    }
    return (0, theme_config_util_1.mergeThemeConfig)(saved);
}
