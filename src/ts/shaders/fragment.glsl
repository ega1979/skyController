uniform sampler2D map;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;

void main() {
    vec4 texel = texture2D(map, vUv);

    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep(fogNear, fogFar, depth);

    gl_FragColor = mix(texel, vec4(fogColor, texel.w), fogFactor);

}