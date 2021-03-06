import * as THREE from 'three';
import {Text} from 'troika-three-text'
import metaversefile from 'metaversefile';
const {useApp, usePostOrthographicScene, useFrame, useCleanup, useInternals} = metaversefile;

const localVector = new THREE.Vector3();

const uniforms = {
    color: {
        type: 'v3',
        value: new THREE.Color(),
    },
    time: {
        type: 'f',
        value: 0.0,
    },
    startTime: {
        type: 'f',
        value: 0.0,
    },
    timeFactor: {
        value: 4.0,
        // needsUpdate: true,
    },
    animTime: {
        value: 6.0,
        // needsUpdate: true,
    },
    factor: {
        value: 0.0,
        // needsUpdate: true,
    },
    iResolution: {
        value: new THREE.Vector3(),
        // needsUpdate: true,
    }
};

const fragmentShader = `\
    precision highp float;
    precision highp int;

    uniform vec3 color;
    void main()
    {
        gl_FragColor = vec4(color, 1.);
    }
`;

const materialTitle = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `\
        precision highp float;
        precision highp int;

        uniform float time;
        uniform float startTime;
        uniform float timeFactor;
        uniform float animTime;
        uniform float factor;
        uniform vec3 iResolution;
        
        const float offsetX = 0.2;
        const float offsetY = 0.3;
        
        void main()
        {
            float factor2 = pow(factor, 0.07);
            float v = (2.-factor2*2.)*0.9;
            vec2 uv = (position.xy + 1.) / 2.;
            vec3 p = position;
            p *= vec3(2000. / iResolution.xy, 1.);
            gl_Position = vec4(p.x + (offsetX * 2. - 1.), p.y + (offsetY * 2. - 1.) + v, -0.1, 1.0);
        }
    `,
    fragmentShader
});

const materialH = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `\
        precision highp float;
        precision highp int;

        uniform float time;
        uniform float startTime;
        uniform float timeFactor;
        uniform float animTime;
        uniform float factor;
        uniform vec3 iResolution;
        
        const float offsetX = 0.55;
        const float offsetY = 0.55;

        void main()
        {
            float factor2 = pow(factor, 0.07);
            float v = (2.-factor2*2.)*0.6;
            vec3 p = position;
            p *= vec3(2000. / iResolution.xy, 1.);
            gl_Position = vec4(p.x + (offsetX * 2. - 1.) + v, p.y + (offsetY * 2. - 1.), -0.1, 1.0);
        }
    `,
    fragmentShader
});

const materialSh = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `\
        precision highp float;
        precision highp int;

        uniform float time;
        uniform float startTime;
        uniform float timeFactor;
        uniform float animTime;
        uniform float factor;
        uniform vec3 iResolution;
        
        const float offsetX = 0.55;
        const float offsetY = 0.45;
        
        void main()
        {
            float factor2 = pow(factor, 0.07);
            float v = (2.-factor2*2.)*0.6;
            vec3 p = position;
            p *= vec3(2000. / iResolution.xy, 1.);
            gl_Position = vec4(p.x + (offsetX * 2. - 1.) + v, p.y + (offsetY * 2. - 1.), -0.1, 1.0);
        }
    `,
    fragmentShader
});

const materialText = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `\
        precision highp float;
        precision highp int;
        
        uniform float time;
        uniform float startTime;
        uniform float timeFactor;
        uniform float animTime;
        uniform float factor;
        uniform vec3 iResolution;
        
        const float offsetX = 0.55;
        const float offsetY = 0.35;
        
        void main()
        {
            float factor2 = pow(factor, 0.07);
            float v = (2.-factor2*2.)*0.6;
            vec3 p = position;
            p *= vec3(2000. / iResolution.xy, 1.);
            gl_Position = vec4(p.x + (offsetX * 2. - 1.) + v, p.y + (offsetY * 2. - 1.), -0.1, 1.0);
        }
    `,
    fragmentShader
});

let _update = null;

let title = null;
let heading = null;
let subHeading = null;
let text = null;

let objs = [null, null, null, null];

async function makeTextMesh(
    text = '',
    material = null,
    font = './fonts/Plaza Regular.ttf',
    fontSize = 1,
    letterSpacing = 0,
    anchorX = 'left',
    anchorY = 'middle',
    color = 0x000000,
  ) {
    const textMesh = new Text();
    textMesh.text = text;
    if (material !== null) {
      textMesh.material = material;
    }
    textMesh.font = font;
    textMesh.fontSize = fontSize;
    textMesh.letterSpacing = letterSpacing;
    textMesh.color = color;
    textMesh.anchorX = anchorX;
    textMesh.anchorY = anchorY;
    textMesh.frustumCulled = false;
    await new Promise(accept => {
      textMesh.sync(accept);
    });
    return textMesh;
  }

export default e => {
    const app = useApp();
    const renderer = useInternals().renderer;
    const postSceneOrthographic = usePostOrthographicScene();

    e.waitUntil((async()=>{
        {
            title = await makeTextMesh(
                'WEBAVERSE',
                materialTitle,
                undefined, // './fonts/WinchesterCaps.ttf',
                0.07,
            )
            objs[0] = title;
            app.add(title);
        }

        {
            heading = await makeTextMesh(
                '',
                materialH,
                undefined,
                0.13
            )
            objs[1] = heading;
            app.add(heading);
        }

        {
            subHeading = await makeTextMesh(
                '',
                materialSh,
                undefined,
                0.07
            )
            objs[2] = subHeading;
            app.add(subHeading);
        }

        {
            text = await makeTextMesh(
                '',
                materialText,
                undefined,
                0.08
            )
            objs[3] = text;
            app.add(text);
        }
    })());
    
    _update = (timestamp, timeDiff) => {
        const time = timestamp/1000;
        const pixelRatio = renderer.getPixelRatio();
        
        const iResolution = renderer.getSize(localVector)
          .multiplyScalar(pixelRatio);
        localVector.z = pixelRatio;
        for (const material of [
            materialTitle,
            materialH,
            materialSh,
            materialText,
        ]) {
            material.uniforms.time.value = time;
            material.uniforms.iResolution.value.copy(iResolution);
        }
    };

    useFrame(({timestamp, timeDiff}) => {
        _update && _update(timestamp, timeDiff);
    });

    useCleanup(()=>{
        for (const obj of objs) {
            if (obj) {
                postSceneOrthographic.remove(obj);
                obj.dispose();
            }
        }
    });

    return app;
}
