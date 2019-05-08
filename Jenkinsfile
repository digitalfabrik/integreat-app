/**
 * Upload a file to browserstack. The environment variable $BROWSERSTACK_LOGIN should contain the login with colons
 * @param path The path to the package
 */
void uploadToBrowserstack(String path) {
    return sh(
            script: '''
                    export UPLOAD_RESPONSE=$(curl -u $BROWSERSTACK_LOGIN -X POST "https://api-cloud.browserstack.com/app-automate/upload" -F "file=@''' + path + '''");
                    python -c "import json; print(json.loads('$UPLOAD_RESPONSE')['app_url'])"
                    ''',
            returnStdout: true
    )
}

pipeline {
    agent any
    options {
        timeout(time: 1, unit: 'HOURS')
        skipDefaultCheckout()
    }
    stages {
        stage('Run on mac and master') {
            parallel {
                stage('mac') {
                    agent {
                        label "mac"
                    }
                    stages {
                        stage("Install dependencies") {
                            steps {
                                checkout scm
                                sh 'yarn'
                            }
                        }
                        stage('Build Release for iOS') {
                            environment {
                                E2E_TEST_IDS = "1"
                                RCT_NO_LAUNCH_PACKAGER = "true"
                                BUNDLE_CONFIG = "./metro.config.ci.js"
                            }
                            steps {
                                lock('pod-install') {
                                    sh 'cd ios && pod install'
                                }
                                sh 'xcodebuild -workspace ios/Integreat.xcworkspace -scheme "Integreat" -configuration Release archive -archivePath output/Integreat.xcarchive ENABLE_BITCODE=NO'
                                sh 'xcodebuild -exportArchive -archivePath output/Integreat.xcarchive -exportOptionsPlist ios/export/development.plist -exportPath output/export'
                                archiveArtifacts artifacts: 'output/export/**/*.*'
                            }
                        }
                        stage('Upload package for E2E') {
                            environment {
                                BROWSERSTACK_LOGIN = credentials("browserstack-login")
                            }
                            steps {
                                script {
                                    env.E2E_BROWSERSTACK_APP = uploadToBrowserstack("output/export/Integreat.ipa")
                                }
                            }
                        }
                        stage('E2E') {
                            environment {
                                BROWSERSTACK_LOGIN = credentials("browserstack-login")
                                E2E_BROWSERSTACK_USER = "$env.BROWSERSTACK_LOGIN_USR"
                                E2E_BROWSERSTACK_KEY = "$env.BROWSERSTACK_LOGIN_PSW"
                                E2E_BROWSERSTACK_APP = "$env.E2E_BROWSERSTACK_APP"
                                // Shared from "Upload package for E2E"
                                E2E_CAPS = 'ci_browserstack_ios'
                                E2E_PLATFORM = 'ios'
                                E2E_SERVER = 'browserstack'
                            }
                            steps {
                                sh 'yarn test:e2e'
                            }
                        }
                    }
                    post {
                        always {
                            cleanWs()
                        }
                    }
                }
                stage('master') {
                    agent {
                        label "master"
                    }
                    stages {
                        stage("Install dependencies") {
                            steps {
                                checkout scm
                                sh 'yarn'
                            }
                        }
                        stage("Build Debug Bundle") {
                            environment {
                                BUNDLE_CONFIG = "./metro.config.ci.js"
                            }
                            steps {
                                sh 'yarn run bundle'
                            }
                        }
                        stage('Build Release for Android') {
                            environment {
                                ANDROID_HOME = '/opt/android-sdk/'
                                E2E_TEST_IDS = "1"
                                BUNDLE_CONFIG = "./metro.config.release.js"
                            }
                            steps {
                                sh 'yarn run flow:check-now'
                                sh 'yarn run lint'
                                sh 'yarn run test'
                                sh 'cd android/ && ./gradlew build -x lint -x lintVitalRelease'
                                archiveArtifacts artifacts: 'android/app/build/outputs/apk/**/*.*'
                            }
                        }
                        stage('Upload package for E2E') {
                            environment {
                                BROWSERSTACK_LOGIN = credentials("browserstack-login")
                            }
                            steps {
                                script {
                                    env.E2E_BROWSERSTACK_APP = uploadToBrowserstack("android/app/build/outputs/apk/release/app-release.apk")
                                }
                            }
                        }
                        stage('E2E') {
                            environment {
                                BROWSERSTACK_LOGIN = credentials("browserstack-login")
                                E2E_BROWSERSTACK_USER = "$env.BROWSERSTACK_LOGIN_USR"
                                E2E_BROWSERSTACK_KEY = "$env.BROWSERSTACK_LOGIN_PSW"
                                E2E_BROWSERSTACK_APP = "$env.E2E_BROWSERSTACK_APP"
                                // Shared from "Upload package for E2E"
                                E2E_CAPS = 'ci_browserstack'
                                E2E_PLATFORM = 'android'
                                E2E_SERVER = 'browserstack'
                            }
                            steps {
                                sh 'yarn test:e2e'
                            }
                        }
                    }
                    post {
                        always {
                            cleanWs()
                        }
                    }
                }
            }
        }
    }
}

