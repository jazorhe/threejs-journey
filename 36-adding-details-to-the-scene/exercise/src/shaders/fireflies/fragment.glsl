uniform float uRed;
uniform float uGreen;
uniform float uBlue;
uniform vec3 uColor;

void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;

    vec3 color = uColor * 1.0;
    gl_FragColor = vec4(color, strength);
}