pipeline {
    agent any
    options {
        timeout(time: 1, unit: 'HOURS')
    }
    stages {
        stage('Run on mac and master') {
            failFast true
            parallel {
                //               stage('mac') {
                //                   agent {
                //                       label "mac"
                //                   }
                //                   stages {
                //                       stage("Install dependencies") {
                //                           steps {
                //                               sh 'yarn'
                //                           }
                //                       }
                //                       stage('Build Release for iOS') {
                //                           steps {
                //                               sh 'cd ios && pod install'
                //                               sh 'xcodebuild -workspace ios/Integreat.xcworkspace -scheme "Integreat" -configuration Release archive -archivePath output/Integreat.xcarchive'
                //                               sh 'xcodebuild -exportArchive -archivePath output/Integreat.xcarchive -exportOptionsPlist ios/export/development.plist -exportPath output/export'
                //                               archiveArtifacts artifacts: 'output/export/**/*.*'
                //                           }
                //                       }
                //                   }
                //               }
                stage('master') {
                    agent {
                        label "master"
                    }
                    stages {
                        stage("Install dependencies") {
                            steps {
                                sh 'yarn'
                            }
                        }
                        //stage("Build Debug Bundle") {
                        //    steps {
                        //        sh 'yarn run bundle'
                        //    }
                        //}
                        stage('Build Release for Android') {
                            environment {
                                ANDROID_HOME = '/opt/android-sdk/'
                            }
                            steps {
                                //        sh 'yarn run flow:check-now'
                                //        sh 'yarn run lint'
                                //        sh 'yarn run test'
                                sh 'yarn run android:release'
                                archiveArtifacts artifacts: 'android/app/build/outputs/apk/**/*.*'
                            }
                        }
                        stage('Upload package for E2E') {
                            environment {
                                LOGIN = credentials("browserstack-login")
                            }
                            steps {
                                script {
                                    E2E_BROWSERSTACK_APP = sh(
                                            script: '''
                                                    export UPLOAD_RESPONSE=$(curl -u $LOGIN -X POST "https://api-cloud.browserstack.com/app-automate/upload" -F "file=@android/app/build/outputs/apk/release/app-release.apk");
                                                    python -c "import json; print(json.loads(\'$UPLOAD_RESPONSE\')[\'app_url\'])"
                                                    ''',
                                            returnStdout: true
                                    )
                                }
                                sh 'echo $E2E_BROWSERSTACK_APP'
                                sh 'echo ${E2E_BROWSERSTACK_APP}'
                            }
                        }
                        stage('E2E') {
                            environment {
                                E2E_CAPS = 'browserstack_ios'
                                E2E_PLATFORM = 'ios'
                                E2E_SERVER = 'browserstack'
                            }
                            steps {
                                sh 'echo $E2E_BROWSERSTACK_APP'
                                sh 'echo ${E2E_BROWSERSTACK_APP}'
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

