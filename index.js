import * as THREE from 'three';
import {Text} from 'troika-three-text'
import metaversefile from 'metaversefile';
const {useApp, useOrthographicScene, useFrame, useCleanup, useInternals} = metaversefile;

const materialTitle = new THREE.ShaderMaterial({
    uniforms:{
        color:{
            type: 'v3',
            value: null
        },
        time:{
            type: 'f',
            value: 0.0,
        },
        startTime:{
            type: 'f',
            value: 0.0,
        },
        timeFactor: {
            value: 4.0,
            needsUpdate: true,
        },
        animTime: {
            value: 6.0,
            needsUpdate: true,
        },
    },
    
    vertexShader: `\
        precision highp float;
        precision highp int;

        uniform float time;
        uniform float startTime;
        uniform float timeFactor;
        uniform float animTime;
        
        const float offsetX = -0.69;
        const float offsetY = 2.65;
        
        void main()
        {

            float f = mod((time - startTime) * timeFactor, animTime);
            f = min(1.49, f);
            f *= 2.0;
            gl_Position = projectionMatrix * vec4(position.x + offsetX, position.y + offsetY - f, -0.1, 1.0);
        }
    `
    ,
    fragmentShader: `\
        precision highp float;
        precision highp int;

        uniform vec3 color;
        void main()
        {
            gl_FragColor = vec4(color, 1.);
        }
    `
});

const materialH = new THREE.ShaderMaterial({
    uniforms:{
        color:{
            type: 'v3',
            value: null
        },
        time:{
            type: 'f',
            value: 0.0,
        },
        startTime:{
            type: 'f',
            value: 0.0,
        },
        timeFactor: {
            value: 4.0,
            needsUpdate: true,
        },
        animTime: {
            value: 6.0,
            needsUpdate: true,
        },
    },
    
    vertexShader: `\
        precision highp float;
        precision highp int;

        uniform float time;
        uniform float startTime;
        uniform float timeFactor;
        uniform float animTime;
        
        const float offsetX = 1.01;
        const float offsetY = 0.33;
        
        void main()
        {

            float f = mod((time - startTime) * timeFactor, animTime);
            if (f > 0.99)
            {
                f = min(1.99, f);
                gl_Position = projectionMatrix * vec4(position.x + offsetX + 0.99 - f, position.y + offsetY, -0.1, 1.0);
            }

        }
    `
    ,
    fragmentShader: `\
        precision highp float;
        precision highp int;

        uniform vec3 color;
        
        void main()
        {
            gl_FragColor = vec4(color, 1.);
        }
    `
});

const materialSh = new THREE.ShaderMaterial({
    uniforms:{
        color:{
            type: 'v3',
            value: null
        },
        time:{
            type: 'f',
            value: 0.0,
        },
        startTime:{
            type: 'f',
            value: 0.0,
        },
        timeFactor: {
            value: 4.0,
            needsUpdate: true,
        },
        animTime: {
            value: 6.0,
            needsUpdate: true,
        },
    },
    
    vertexShader: `\
        precision highp float;
        precision highp int;

        uniform float time;
        uniform float startTime;
        uniform float timeFactor;
        uniform float animTime;
        
        const float offsetX = 1.01;
        const float offsetY = 0.14;
        
        void main()
        {
            float f = mod((time - startTime) * timeFactor, animTime);
            if (f > 1.99)
            {
                f = min(2.99, f);
                gl_Position = projectionMatrix * vec4(position.x + offsetX + 1.99 - f, position.y + offsetY, -0.1, 1.0);
            }
        }
    `
    ,
    fragmentShader: `\
        precision highp float;
        precision highp int;
        
        uniform vec3 color;
        
        void main()
        {
            gl_FragColor = vec4(color, 1.);
        }
    `
    ,
});

const materialText = new THREE.ShaderMaterial({
    uniforms:{
        color:{
            type: 'v3',
            value: null
        },
        time:{
            type: 'f',
            value: 0.0,
        },
        startTime:{
            type: 'f',
            value: 0.0,
        },
        timeFactor: {
            value: 4.0,
            needsUpdate: true,
        },
        animTime: {
            value: 6.0,
            needsUpdate: true,
        },
    },
    
    vertexShader: `\
        precision highp float;
        precision highp int;
        
        uniform float time;
        uniform float startTime;
        uniform float timeFactor;
        uniform float animTime;
        
        const float offsetX = 1.01;
        const float offsetY = 0.0;
        
        void main()
        {

            float f = mod((time - startTime) * timeFactor, animTime);
            if (f > 2.99)
            {
                f = min(3.99, f);
                gl_Position = projectionMatrix * vec4(position.x + offsetX + 2.99 - f, position.y + offsetY, -0.1, 1.0);
            }
        }
    `
    ,
    fragmentShader: `\
        precision highp float;
        precision highp int;

        uniform vec3 color;
        void main()
        {
            gl_FragColor = vec4(color, 1.);
        }
    `
});

let _update = null;

let title = null;
let heading = null;
let subHeading = null;
let text = null;

let objs = [null, null, null, null];

export default e => {
    const app = useApp();
    const sceneOrthographic = useOrthographicScene();

    e.waitUntil((async()=>{
        {   
            title = new Text();
            title.text = "WEBAVERSE";
            title.font = './fonts/Plaza Regular.ttf';
            title.fontSize = 0.05;
            title.anchorX = 'middle';
            title.anchorY = 'middle';
            title.material = materialTitle;
            
            title.material.uniforms.color.value = new THREE.Vector3(1.0, 1.0, 1.0);

            objs[0] = title;
                        
            title.sync();
            app.add(title);
        }

        {
            heading = new Text();
            heading.font = './fonts/Plaza Regular.ttf';
            heading.fontSize = 0.13;
            heading.anchorX = 'left';
            heading.anchorY = 'middle';
            heading.material = materialH;
            
            heading.material.uniforms.color.value = new THREE.Vector3(1.0, 1.0, 1.0);
                        
            objs[1] = heading;

            heading.sync();
            app.add(heading);
        }

        {
            subHeading = new Text();
            subHeading.font = './fonts/Plaza Regular.ttf';
            subHeading.fontSize = 0.07;
            subHeading.anchorX = 'left';
            subHeading.anchorY = 'middle';
            subHeading.material = materialSh;
            
            subHeading.material.uniforms.color.value = new THREE.Vector3(1.0, 1.0, 1.0);
            
            objs[2] = subHeading;           
            
            subHeading.sync();
            app.add(subHeading);
        }

        {
            text = new Text();
            text.font = './fonts/Plaza Regular.ttf';
            text.fontSize = 0.08;
            text.anchorX = 'left';
            text.anchorY = 'middle';
            text.material = materialText;
            
            text.material.uniforms.color.value = new THREE.Vector3(1.0, 1.0, 1.0);
            
            objs[3] = text;           
            
            text.sync();
            app.add(text);
        }
    })());
    
    let now = 0;
    _update = (timestamp, timeDiff) => {
        materialTitle.uniforms.time.value = timestamp/1000;
        materialH.uniforms.time.value = timestamp/1000;
        materialSh.uniforms.time.value = timestamp/1000;
        materialText.uniforms.time.value = timestamp/1000;

        now += timeDiff;
    };

    useFrame(({timestamp, timeDiff}) => {
        _update && _update(timestamp, timeDiff);
    });

    useCleanup(()=>{
        for (const obj of objs) {
            if (obj) {
                sceneOrthographic.remove(obj);
                obj.dispose();
            }
        }
    });

    return app;
}
