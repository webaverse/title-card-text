import * as THREE from 'three';
import {Text} from 'troika-three-text'
import metaversefile from 'metaversefile';
const {useApp, usePostScene, useFrame, useCleanup} = metaversefile;

const materialTitle = new THREE.ShaderMaterial({
    uniforms:{
        lProjectionMatrix:{
            type: 'mat4',
            value: null
        },

        lViewMatrix:{
            type: 'mat4',
            value: null
        },

        color:{
            type: 'v3',
            value: null
        },

        time:{
            type: 'f',
            value: 0.0,
        }
    },
    
    vertexShader: `\
        precision highp float;
        precision highp int;

        uniform mat4 lProjectionMatrix;
        uniform mat4 lViewMatrix;
        uniform float time;
        
        float offsetX = -690.0;
        float offsetY = 2650.0;
        
        const float timeFactor = 4.0;
        const float animTime = 6.0;
        
        void main()
        {
            float f = mod(time * timeFactor, animTime);
            f = min(1.49, f);
            f *= 2000.0;
            gl_Position = lProjectionMatrix * lViewMatrix * vec4(position.x + offsetX, position.y + offsetY - f, -1.0, 1.0);
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
        lProjectionMatrix:{
            type: 'mat4',
            value: null
        },

        lViewMatrix:{
            type: 'mat4',
            value: null
        },

        color:{
            type: 'v3',
            value: null
        },

        time:{
            type: 'f',
            value: 0.0,
        }
    },
    
    vertexShader: `\
        precision highp float;
        precision highp int;

        uniform mat4 lProjectionMatrix;
        uniform mat4 lViewMatrix;
        uniform float time;
        
        float offsetX = 1010.0;
        float offsetY = 330.0;
        
        const float timeFactor = 4.0;
        const float animTime = 6.0;
        
        void main()
        {
            float f = mod(time * timeFactor, animTime);
            if (f > 0.99)
            {
                f = min(1.99, f);
                f *= 1000.0;
                gl_Position = lProjectionMatrix * lViewMatrix * vec4(position.x + offsetX + (0.99 * 1000.0) - f, position.y + offsetY, -1.0, 1.0);
            }

        }
    `
    ,
    fragmentShader: `\
        uniform vec3 color;
        void main()
        {
            gl_FragColor = vec4(color, 1.);
        }
    `
});

const materialSh = new THREE.ShaderMaterial({
    uniforms:{
        lProjectionMatrix:{
            type: 'mat4',
            value: null
        },

        lViewMatrix:{
            type: 'mat4',
            value: null
        },

        color:{
            type: 'v3',
            value: null
        },

        time:{
            type: 'f',
            value: 0.0,
        }
    },
    
    vertexShader: `\
        precision highp float;
        precision highp int;

        uniform mat4 lProjectionMatrix;
        uniform mat4 lViewMatrix;
        uniform float time;
        
        float offsetX = 1010.0;
        float offsetY = 140.0;
        
        const float timeFactor = 4.0;
        const float animTime = 6.0;
        
        void main()
        {
            float f = mod(time * timeFactor, animTime);
            if (f > 1.99)
            {
                f = min(2.99, f);
                f *= 1000.0;
                gl_Position = lProjectionMatrix * lViewMatrix * vec4(position.x + offsetX + (1.99 * 1000.0) - f, position.y + offsetY, -1.0, 1.0);
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
        lProjectionMatrix:{
            type: 'mat4',
            value: null
        },

        lViewMatrix:{
            type: 'mat4',
            value: null
        },

        color:{
            type: 'v3',
            value: null
        },

        time:{
            type: 'f',
            value: 0.0,
        }
    },
    
    vertexShader: `\
        precision highp float;
        precision highp int;
        
        uniform mat4 lProjectionMatrix;
        uniform mat4 lViewMatrix;
        uniform float time;
        
        float offsetX = 1010.0;
        float offsetY = 0.0;
        
        const float timeFactor = 4.0;
        const float animTime = 6.0;
        
        void main()
        {
            float f = mod(time * timeFactor, animTime);
            if (f > 2.99)
            {
                f = min(3.99, f);
                f *= 1000.0;
                gl_Position = lProjectionMatrix * lViewMatrix * vec4(position.x + offsetX + (2.99 * 1000.0) - f, position.y + offsetY, -1.0, 1.0);
            }
        }
    `
    ,
    fragmentShader: `\
        uniform vec3 color;
        void main()
        {
            gl_FragColor = vec4(color, 1.);
        }
    `
});

const orthographicCamera = new THREE.OrthographicCamera(-1000, 1000, 1000, -1000, 0.1, 1000);
// orthographicCamera.position.set(0, 0, 1);
// orthographicCamera.lookAt(new THREE.Vector3(0, 0, 0));
let _update = null;

let title = null;
let heading = null;
let subHeading = null;
let text = null;

let objs = [null, null, null, null];

export default () => {
    const app = useApp();
    const postScene = usePostScene();

    {
        {   
            title = new Text();
            title.text = "WEBAVERSE";
            title.font = './fonts/Plaza Regular.ttf';
            title.fontSize = 50;
            title.anchorX = 'middle';
            title.anchorY = 'middle';
            title.material = materialTitle;
            
            title.material.uniforms.color.value = new THREE.Vector3(1.0, 1.0, 1.0);
            title.material.uniforms.lProjectionMatrix.value = orthographicCamera.projectionMatrix;
            title.material.uniforms.lViewMatrix.value = orthographicCamera.matrixWorldInverse;

            objs[0] = title;
                        
            title.sync();
            postScene.add(title);
        }

        {
            heading = new Text();
            heading.text = app.getComponent("heading") ? app.getComponent("heading") : "HEADING";
            heading.font = './fonts/Plaza Regular.ttf';
            heading.fontSize = 130;
            heading.anchorX = 'left';
            heading.anchorY = 'middle';
            heading.material = materialH;
            
            heading.material.uniforms.color.value = new THREE.Vector3(1.0, 1.0, 1.0);
            heading.material.uniforms.lProjectionMatrix.value = orthographicCamera.projectionMatrix;
            heading.material.uniforms.lViewMatrix.value = orthographicCamera.matrixWorldInverse;
                        
            objs[1] = heading;
            
            heading.sync();
            postScene.add(heading);
        }

        {
            subHeading = new Text();
            subHeading.text = app.getComponent("subHeading") ? app.getComponent("subHeading") : "SUBHEADING";
            subHeading.font = './fonts/Plaza Regular.ttf';
            subHeading.fontSize = 70;
            subHeading.anchorX = 'left';
            subHeading.anchorY = 'middle';
            subHeading.material = materialSh;
            
            subHeading.material.uniforms.color.value = new THREE.Vector3(1.0, 1.0, 1.0);
            subHeading.material.uniforms.lProjectionMatrix.value = orthographicCamera.projectionMatrix;
            subHeading.material.uniforms.lViewMatrix.value = orthographicCamera.matrixWorldInverse;
            
            objs[2] = subHeading;           
            
            subHeading.sync();
            postScene.add(subHeading);
        }

        {
            text = new Text();
            text.text = app.getComponent("text") ? app.getComponent("text") : "TEXT";
            text.font = './fonts/Plaza Regular.ttf';
            text.fontSize = 80;
            text.anchorX = 'left';
            text.anchorY = 'middle';
            text.material = materialText;
            
            text.material.uniforms.color.value = new THREE.Vector3(1.0, 1.0, 1.0);
            text.material.uniforms.lProjectionMatrix.value = orthographicCamera.projectionMatrix;
            text.material.uniforms.lViewMatrix.value = orthographicCamera.matrixWorldInverse;
            
            objs[3] = text;           
            
            text.sync();
            postScene.add(text);
        }

        
        let now = 0;
        _update = (timestamp, timeDiff) => {
            materialTitle.uniforms.time.value = timestamp/1000;
            materialH.uniforms.time.value = timestamp/1000;
            materialSh.uniforms.time.value = timestamp/1000;
            materialText.uniforms.time.value = timestamp/1000;

            now += timeDiff;
        };
    }

    useFrame(({timestamp, timeDiff}) => {
        _update && _update(timestamp, timeDiff);
    });

    useCleanup(()=>{
        for (const obj of objs) {
            if (obj) {
                postScene.remove(obj);
                obj.dispose();
            }
        }
    });

    return app;
}
